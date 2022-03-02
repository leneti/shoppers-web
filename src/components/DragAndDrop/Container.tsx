import React, { useState, useEffect } from "react";

import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from "@react-forked/dnd";
import { Box } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

import Column from "./Column";
import { ParsedData } from "../../api/VisionParser";

export interface ThreeLists {
  common: { discount?: string; name: string; price: string }[];
  dom: { discount?: string; name: string; price: string }[];
  emilija: { discount?: string; name: string; price: string }[];
}

export default function Container({
  googleResGlobal,
  grid,
  listContainerStyle,
  setAllListsGlobal,
}: {
  googleResGlobal: ParsedData;
  grid: number;
  listContainerStyle: React.CSSProperties | undefined;
  setAllListsGlobal: React.Dispatch<React.SetStateAction<ThreeLists>>;
}) {
  const { width } = useViewportSize();

  const [allLists, setAllLists] = useState<ThreeLists>({
    common: googleResGlobal.items,
    dom: [],
    emilija: [],
  });

  useEffect(() => setAllListsGlobal(allLists), [allLists]);

  function reorder(
    list: { discount?: string; name: string; price: string }[],
    startIndex: number,
    endIndex: number
  ) {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  function move(
    droppableSource: DraggableLocation,
    droppableDestination: DraggableLocation,
    sourceListId: "common" | "dom" | "emilija",
    destListId: "common" | "dom" | "emilija"
  ) {
    const sourceClone = [...allLists[sourceListId]];
    const destClone = [...allLists[destListId]];
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = { ...allLists };
    result[sourceListId] = sourceClone;
    result[destListId] = destClone;

    return result;
  }

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }

    const sourceListId = source.droppableId;
    const destListId = destination.droppableId;

    if (
      sourceListId !== "common" &&
      sourceListId !== "dom" &&
      sourceListId !== "emilija"
    )
      return;
    if (
      destListId !== "common" &&
      destListId !== "dom" &&
      destListId !== "emilija"
    )
      return;

    if (source.droppableId === destination.droppableId) {
      const itemsReordered = reorder(
        allLists[sourceListId],
        source.index,
        destination.index
      );

      setAllLists((p) => ({
        ...p,
        [sourceListId]: itemsReordered,
      }));
    } else {
      const result = move(source, destination, sourceListId, destListId);

      setAllLists(result);
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        style={{
          display: "flex",
          flexDirection: width > 1350 ? "row" : "column",
        }}
      >
        <Column
          listID="common"
          items={allLists.common}
          grid={grid}
          listContainerStyle={listContainerStyle}
          title="All items"
          footer="Total price:"
        />
        <Column
          listID="dom"
          items={allLists.dom}
          grid={grid}
          listContainerStyle={listContainerStyle}
          title="Dom's items"
          footer="Dom's total:"
        />
        <Column
          listID="emilija"
          items={allLists.emilija}
          grid={grid}
          listContainerStyle={listContainerStyle}
          title="Emilija's items"
          footer="Emilija's total:"
        />
      </Box>
    </DragDropContext>
  );
}

import React, { CSSProperties } from "react";

import { Box, Text, useMantineTheme } from "@mantine/core";
import { Droppable, DroppableProvided } from "@react-forked/dnd";
import { FixedSizeList } from "react-window";

import Item, { ItemClone } from "./Item";
import { ItemData } from "../../api/VisionParser";

interface RowProps {
  data: {
    discount?: string;
    name: string;
    price: string;
  }[];
  index: number;
  style: CSSProperties;
}

export default function Column({
  items,
  grid,
  listContainerStyle,
  listID,
  title,
  footer,
}: {
  items: ItemData[];
  grid: number;
  listContainerStyle: React.CSSProperties | undefined;
  listID: string;
  title: string;
  footer: string;
}) {
  const theme = useMantineTheme();
  const Row = (props: RowProps) => {
    const { data: items, index, style } = props;
    const item = items[index];

    if (!item) {
      return null;
    }

    return (
      <Item
        key={`${item.name}-${index}`}
        grid={grid}
        item={item}
        index={index}
        vStyle={style}
        listContainerStyle={listContainerStyle}
      />
    );
  };
  const ItemList = (provided: DroppableProvided, itemCount: number) => {
    return (
      <FixedSizeList
        itemData={items}
        width={listContainerStyle?.width ?? 300}
        height={listContainerStyle?.height ?? 450}
        itemSize={60}
        itemCount={itemCount}
        outerRef={provided.innerRef}
        className="item-list"
      >
        {Row}
      </FixedSizeList>
    );
  };

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colors.background[1],
        borderRadius: theme.radius.lg,
        borderColor: theme.colors.primary[5],
        borderWidth: 2,
        borderStyle: "solid",
        margin: "auto",
        padding: 8,
      })}
      style={listContainerStyle}
    >
      <Text size="xl" style={{ marginBottom: 15, marginTop: 10 }}>
        {title}
      </Text>
      <Droppable
        droppableId={listID}
        mode="virtual"
        renderClone={(provided, snapshot, rubric) => (
          <ItemClone
            item={items[rubric.source.index]}
            grid={grid}
            key={`${items[rubric.source.index].name}-${
              rubric.source.index
            }-clone`}
            provided={provided}
            snapshot={snapshot}
            listContainerStyle={listContainerStyle}
          />
        )}
      >
        {(provided, snapshot) => {
          const itemCount = snapshot.isUsingPlaceholder
            ? items.length + 1
            : items.length;

          return (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {ItemList(provided, itemCount)}
            </Box>
          );
        }}
      </Droppable>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Text style={{ marginBottom: 10, marginTop: 15 }}>{footer}</Text>
        <Text
          weight="bold"
          color={theme.colors.primary[4]}
          style={{ marginBottom: 10, marginTop: 15 }}
        >
          £
          {items
            .reduce(
              (a, c) => a + parseFloat(c.price) + parseFloat(c.discount ?? "0"),
              0
            )
            .toFixed(2)}
        </Text>
      </Box>
    </Box>
  );
}

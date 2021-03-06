import { CSSProperties, useMemo } from "react";

import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggableStyle,
  DraggingStyle,
  NotDraggingStyle,
} from "@react-forked/dnd";
import { Box, MantineTheme, Text, useMantineTheme } from "@mantine/core";
import { ItemData } from "../../api/VisionParser";

function isDragged(
  dragStyle: DraggingStyle | NotDraggingStyle
): dragStyle is DraggingStyle {
  return "width" in dragStyle;
}

function getItemStyle(
  isDragging: boolean,
  draggableStyle: DraggableStyle,
  grid: number,
  theme: MantineTheme,
  virtualStyle?: CSSProperties
): CSSProperties {
  const combined = {
    ...virtualStyle,
    ...draggableStyle,
  };

  return {
    ...combined,

    height: isDragging
      ? combined.height
      : typeof combined.height === "number"
      ? combined.height - grid
      : `calc(${combined.height} - ${grid}px)`,
    left: isDragging
      ? combined.left
      : typeof combined.left === "number"
      ? combined.left + grid
      : `calc(${combined.left} + ${grid}px)`,
    width:
      isDragging && isDragged(draggableStyle)
        ? draggableStyle.width
        : `calc(${combined.width} - ${grid * 2}px)`,
    marginBottom: grid,

    userSelect: "none",
    background: isDragging
      ? theme.colors.background[2]
      : theme.colors.background[4],
    borderRadius: theme.radius.md,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  };
}

export default function Item({
  grid,
  item,
  index,
  vStyle,
}: {
  grid: number;
  item: ItemData;
  index: number;
  vStyle: CSSProperties;
}) {
  const theme = useMantineTheme();

  return useMemo(
    () => (
      <Draggable
        key={`${item.name}-${index}`}
        draggableId={`${item.name}-${index}`}
        index={index}
      >
        {(provided, snapshot) =>
          !!provided.draggableProps.style && (
            <Box
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style,
                grid,
                theme,
                vStyle
              )}
            >
              <Text style={{ marginLeft: 12 }} color={theme.colors.primary[4]}>
                {item.name}
              </Text>
              <Text style={{ marginRight: 12 }} color={theme.colors.primary[5]}>
                ??{item.price}
              </Text>
            </Box>
          )
        }
      </Draggable>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item, index, grid]
  );
}

export function ItemClone({
  grid,
  item,
  provided,
  snapshot,
}: {
  grid: number;
  item: ItemData;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}) {
  const theme = useMantineTheme();

  return !provided.draggableProps.style ? null : (
    <Box
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getItemStyle(
        snapshot.isDragging,
        provided.draggableProps.style,
        grid,
        theme
      )}
    >
      <Text style={{ marginLeft: 12 }} color={theme.colors.primary[4]}>
        {item.name}
      </Text>
      <Text style={{ marginRight: 12 }} color={theme.colors.primary[5]}>
        ??{item.price}
      </Text>
    </Box>
  );
}

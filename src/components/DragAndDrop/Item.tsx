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
  listContainerStyle: React.CSSProperties | undefined,
  virtualStyle?: CSSProperties
): CSSProperties {
  const itemWidth = listContainerStyle?.width ?? 300;

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
  listContainerStyle,
}: {
  grid: number;
  item: { discount?: string; name: string; price: string };
  index: number;
  vStyle: CSSProperties;
  listContainerStyle: React.CSSProperties | undefined;
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
                listContainerStyle,
                vStyle
              )}
            >
              <Text style={{ marginLeft: 12 }} color={theme.colors.primary[4]}>
                {item.name}
              </Text>
              <Text style={{ marginRight: 12 }} color={theme.colors.primary[5]}>
                £{item.price}
              </Text>
            </Box>
          )
        }
      </Draggable>
    ),
    [item, index, grid]
  );
}

export function ItemClone({
  grid,
  item,
  provided,
  snapshot,
  listContainerStyle,
}: {
  grid: number;
  item: { discount?: string; name: string; price: string };
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  listContainerStyle: React.CSSProperties | undefined;
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
        theme,
        listContainerStyle
      )}
    >
      <Text style={{ marginLeft: 12 }} color={theme.colors.primary[4]}>
        {item.name}
      </Text>
      <Text style={{ marginRight: 12 }} color={theme.colors.primary[5]}>
        £{item.price}
      </Text>
    </Box>
  );
}

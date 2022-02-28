import { CSSProperties } from "react";

import { Draggable, DraggableStyle } from "@react-forked/dnd";
import { Box, Text, useMantineTheme } from "@mantine/core";

export default function Item({
  grid,
  item,
  index,
}: {
  grid: number;
  item: { discount?: string; name: string; price: string };
  index: number;
}) {
  const theme = useMantineTheme();

  function getItemStyle(
    isDragging: boolean,
    draggableStyle: DraggableStyle
  ): CSSProperties {
    return {
      userSelect: "none",
      paddingTop: grid * 2,
      paddingBottom: grid * 2,
      paddingRight: grid * 3,
      paddingLeft: grid * 3,
      margin: `0 0 ${grid}px 0`,
      background: isDragging
        ? theme.colors.background[2]
        : theme.colors.background[4],
      borderRadius: theme.radius.md,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",

      ...draggableStyle, // styles we need to apply on draggables
    };
  }

  return (
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
              provided.draggableProps.style
            )}
          >
            <Text color={theme.colors.primary[4]}>{item.name}</Text>
            <Text color={theme.colors.primary[5]}>£{item.price}</Text>
          </Box>
        )
      }
    </Draggable>
  );
}

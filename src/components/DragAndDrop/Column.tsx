import React, { useMemo } from "react";

import { Box, Text } from "@mantine/core";
import { Droppable } from "@react-forked/dnd";

import Item from "./Item";

interface ItemListProps {
  items: { discount?: string; name: string; price: string }[];
}

export default function Column({
  items,
  grid,
  listContainerStyle,
  listID,
  title,
}: {
  items: { discount?: string; name: string; price: string }[];
  grid: number;
  listContainerStyle: React.CSSProperties | undefined;
  listID: string;
  title: string;
}) {
  const ItemList = useMemo(
    () =>
      items.map((item, index) => (
        <Item
          key={`${item.name}-${index}`}
          grid={grid}
          item={item}
          index={index}
        />
      )),
    [items]
  );

  return (
    <Droppable droppableId={listID}>
      {(provided) => (
        <Box
          {...provided.droppableProps}
          ref={provided.innerRef}
          sx={(theme) => ({
            backgroundColor: theme.colors.background[1],
            borderRadius: theme.radius.lg,
            borderColor: theme.colors.primary[5],
            borderWidth: 2,
            borderStyle: "solid",
            margin: "auto",
            padding: grid,
          })}
          style={listContainerStyle}
        >
          <Text size="xl" style={{ marginBottom: 15, marginTop: 10 }}>
            {title}
          </Text>
          {ItemList}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
}

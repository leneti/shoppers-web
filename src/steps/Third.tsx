import React, { useState, useEffect, CSSProperties } from "react";

import { Box, Text, useMantineTheme } from "@mantine/core";
import ReactJson from "react-json-view";

import DnDContainer from "../components/DragAndDrop/Container";

const DEV = false;

export default function ThirdStep({
  nextStep,
  prevStep,
  googleResGlobal,
}: {
  nextStep: () => void;
  prevStep: () => void;
  googleResGlobal:
    | {
        date: string | null;
        market: string | null;
        items: { discount?: string; name: string; price: string }[];
        time: string | null;
        total: number;
      }
    | undefined;
}) {
  const theme = useMantineTheme();

  return (
    <Box>
      <div>Separate items from the common list</div>

      {!!googleResGlobal && DEV && (
        <Box
          style={{
            minWidth: 500,
            textAlign: "start",
            fontSize: 18,
            marginBottom: 25,
          }}
        >
          <Text weight="bold">Google response</Text>
          <ReactJson src={googleResGlobal} theme="tomorrow" collapsed={true} />
        </Box>
      )}

      {!!googleResGlobal && (
        <DnDContainer
          googleResGlobal={googleResGlobal}
          grid={8}
          listContainerStyle={{ width: 300, marginTop: 20 }}
        />
      )}
    </Box>
  );
}

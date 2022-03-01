import React, { useState } from "react";

import { Box, Text, useMantineTheme } from "@mantine/core";
import ReactJson from "react-json-view";

import DnDContainer from "../components/DragAndDrop/Container";

const DEV = false;

export default function ThirdStep({
  nextStep,
  prevStep,
  googleResGlobal,
  setAllListsGlobal,
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
  setAllListsGlobal: React.Dispatch<
    React.SetStateAction<{
      common: { discount?: string; name: string; price: string }[];
      dom: { discount?: string; name: string; price: string }[];
      emilija: { discount?: string; name: string; price: string }[];
    }>
  >;
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
          <Text>{JSON.stringify(googleResGlobal)}</Text>
        </Box>
      )}

      {!!googleResGlobal && (
        <DnDContainer
          googleResGlobal={googleResGlobal}
          setAllListsGlobal={setAllListsGlobal}
          grid={10}
          listContainerStyle={{ width: 300, marginTop: 20 }}
        />
      )}
    </Box>
  );
}

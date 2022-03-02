import React, { useState } from "react";

import { Box, Button, Group, Text } from "@mantine/core";
import ReactJson from "react-json-view";

import DnDContainer, { ThreeLists } from "../components/DragAndDrop/Container";
import { ParsedData } from "../api/VisionParser";
import { updateFirestoreDoc } from "../api/Firestore";

const DEV = false;

export default function ThirdStep({
  nextStep,
  prevStep,
  googleResGlobal,
  setAllListsGlobal,
  allListsGlobal,
  firestorePathGlobal,
}: {
  nextStep: () => void;
  prevStep: (toStart: boolean) => void;
  googleResGlobal: ParsedData | undefined;
  setAllListsGlobal: React.Dispatch<React.SetStateAction<ThreeLists>>;
  allListsGlobal: ThreeLists;
  firestorePathGlobal: string;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  function calculateTotals() {
    const commonTotal = allListsGlobal.common.reduce(
      (a, c) => a + parseFloat(c.price) + parseFloat(c.discount ?? "0"),
      0
    );
    const emilijaTotal =
      allListsGlobal.emilija.reduce(
        (a, c) => a + parseFloat(c.price) + parseFloat(c.discount ?? "0"),
        0
      ) +
      commonTotal * 0.4;
    const domTotal =
      allListsGlobal.dom.reduce(
        (a, c) => a + parseFloat(c.price) + parseFloat(c.discount ?? "0"),
        0
      ) +
      commonTotal * 0.6;
    return {
      both: commonTotal,
      em: emilijaTotal,
      dom: domTotal,
      full: emilijaTotal + domTotal,
    };
  }

  async function updateFirestore() {
    setIsUpdating(true);
    const data = {
      totals: calculateTotals(),
      emilija: allListsGlobal.emilija,
      dom: allListsGlobal.dom,
      common: allListsGlobal.common,
    };
    await updateFirestoreDoc(firestorePathGlobal, data);
    nextStep();
  }

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

      <Group style={{ marginTop: 50 }} position="center" mt="xl">
        <Button
          variant="default"
          onClick={() => prevStep(true)}
          loading={isUpdating}
        >
          Try again
        </Button>
        <Button color="yellow" onClick={updateFirestore} loading={isUpdating}>
          Split it!
        </Button>
      </Group>
    </Box>
  );
}

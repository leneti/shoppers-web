import React, { CSSProperties, useMemo, useState } from "react";
import { Box, Button, Slider, Text, useMantineTheme } from "@mantine/core";
import { ThreeLists } from "../components/DragAndDrop/Container";
import { ExternalLinkIcon } from "@modulz/radix-icons";

const DEV = false;

export default function FinalStep({
  allListsGlobal,
}: {
  allListsGlobal: ThreeLists;
}) {
  const theme = useMantineTheme();

  const [domRatio, setDomRatio] = useState(0.6);

  const totals = useMemo(() => {
    const commonTotal = allListsGlobal.common.reduce(
      (a, c) => a + parseFloat(c.price) + parseFloat(c.discount ?? "0"),
      0
    );
    const emilijaTotal =
      allListsGlobal.emilija.reduce(
        (a, c) => a + parseFloat(c.price) + parseFloat(c.discount ?? "0"),
        0
      ) +
      commonTotal * (1 - domRatio);
    const domTotal =
      allListsGlobal.dom.reduce(
        (a, c) => a + parseFloat(c.price) + parseFloat(c.discount ?? "0"),
        0
      ) +
      commonTotal * domRatio;
    const all = emilijaTotal + domTotal;
    return {
      emilija: emilijaTotal.toFixed(2),
      dom: domTotal.toFixed(2),
      all: all.toFixed(2),
    };
  }, [allListsGlobal, domRatio]);

  const Total = ({
    price,
    label,
    size,
    style,
  }: {
    price: string;
    label: string;
    size: number;
    style?: CSSProperties;
  }) => (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
        ...style,
      }}
    >
      <Text style={{ marginRight: 10, fontSize: size }}>{label}</Text>
      <Text
        weight="bold"
        color={theme.colors.primary[4]}
        style={{ fontSize: size }}
      >
        £{price}
      </Text>
    </Box>
  );

  return (
    <Box>
      {/* <div>Visit Splitwise to settle expenses</div> */}
      <Total
        price={totals.all}
        label="Total:"
        size={30}
        style={{ justifyContent: "center" }}
      />
      <Text color="gray">
        Split: <b>Dom</b> {(domRatio * 100).toFixed(0)}/
        {((1 - domRatio) * 100).toFixed(0)} <b>Emilija</b>
      </Text>
      {DEV && (
        <Slider
          color="primary"
          value={domRatio * 100}
          onChange={(value) => setDomRatio(value / 100)}
          min={0}
          max={100}
          label={null}
          step={1}
          style={{ width: 200, margin: "auto" }}
        />
      )}
      <Total
        price={totals.dom}
        label="Dom's total:"
        size={20}
        style={{ justifyContent: "space-between", width: 200, marginTop: 50 }}
      />
      <Total
        price={totals.emilija}
        label="Emilija's total:"
        size={20}
        style={{ justifyContent: "space-between", width: 200 }}
      />

      <Box style={{ display: "flex", marginTop: 30 }}>
        <Button
          component="a"
          target="_blank"
          href="https://secure.splitwise.com/#/groups/25925993"
          leftIcon={<ExternalLinkIcon />}
          color="primary"
          variant="outline"
        >
          Visit Splitwise to settle expenses
        </Button>
      </Box>
    </Box>
  );
}

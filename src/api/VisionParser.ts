export type Market = "LIDL" | "ALDI" | "COOP" | null;

export interface ItemData {
  name: string;
  price: string;
  discount?: string;
}

export interface ParsedData {
  date: string | null;
  market: Market;
  items: ItemData[];
  time: string | null;
  total: number;
}

export interface Annotation {
  locale: string;
  description: string;
  boundingPoly: { vertices: { x: number; y: number }[] };
}

const SKIPWORDS = {
  LIDL: [
    "£",
    "dundee",
    "vat",
    "no.",
    "no:",
    "соpy",
    "copy",
    "gb350396892",
    "card",
    "*customer",
    "copy*",
    "please",
    "retain",
    "receipt",
    "date:",
    "time:",
    "===",
    "total",
    "тоtal",
    "тотal",
    "toial",
    "t0tal",
    "tоtal",
    "discount",
    "a",
    "b",
    "mid:",
    "trns",
    "visa",
    "prepaid",
    "a0000000031010",
    "***16872",
    "dun",
    "-city",
    "centre",
  ],
  ALDI: ["stores", "41", "gushetfaulds", "st", "glasgow", "gbp", "a", "b"],
  COOP: [
    "store:",
    "crown",
    "street",
    "(sf)",
    "tel:",
    "01414",
    "206510",
    "qty",
    "item",
  ],
};
const STOPWORDS = {
  LIDL: ["tid:", "sale"],
  ALDI: ["card", "number:", "************"],
  COOP: ["credit/debit", "becoming", "earned:"],
};

/* #region  Helper Functions */
function isInteger(val: string) {
  if (!/^-?\d+$/.test(val)) return false;
  let intVal = parseInt(val);
  return parseFloat(val) === intVal && !isNaN(intVal);
}

function parseDate(dateStr: string) {
  const parsedDate = dateStr.match(/[0-3][0-9][./-][0-1][0-9][./-][0-9][0-9]/); // Matches the UK date locale
  return parsedDate ? parsedDate[0] : null;
}

function parseTime(timeStr: string) {
  const parsedTime = timeStr.match(/[0-2][0-9]:[0-5][0-9]:[0-5][0-9]/);
  return parsedTime ? parsedTime[0] : null;
}

function checkPrice(str: string) {
  let pr = str.includes(" ") ? str.split(" ")[0] : str;
  pr.replace("A", "").replace("B", "");
  return /^[-]?\d+[.]\d{2}$/.test(pr) ? pr : null;
}

function checkMarket(str: string, str2: string = ""): Market {
  let mStr = str.toUpperCase().split(" ");
  mStr.push(str2.toUpperCase());

  if (mStr.includes("ALDI")) return "ALDI";

  if (mStr.includes("COOP") || (mStr.includes("CO") && mStr.includes("OP")))
    return "COOP";

  if (
    mStr.includes("LIDL") ||
    (str[0] === "L" && str.substring(2, 4) === "DL" && str.length < 7) ||
    (mStr.includes("L") && mStr.includes("DL")) ||
    (str.substring(0, 3) === "LID" && str.length < 7) ||
    (str.substring(0, 3) === "LDL" && str.length < 6) ||
    str.substring(0, 4) === "LinL"
  )
    return "LIDL";

  return null;
}

function checkAnnotationType(str: string, str2: string = "") {
  if (str[str.length - 1] === ",") return "hanging";
  if (parseDate(str)) return "date";
  if (parseTime(str)) return "time";
  if (checkMarket(str, str2)) return "market";
  if (checkPrice(str)) return "number";
  if (isInteger(str)) return "int";
  return "text";
}

function checkItemName(str: string) {
  let numAlpha = 0;
  for (const ch of str) if (/[a-zA-Z]/.test(ch)) numAlpha++;
  return numAlpha > 2;
}

function getMinMaxes(vertices: { x: number; y: number }[]) {
  return vertices.reduce(
    (a, c) => ({
      xmin: Math.min(c.x, a.xmin),
      xmax: Math.max(c.x, a.xmax),
      ymin: Math.min(c.y, a.ymin),
      ymax: Math.max(c.y, a.ymax),
    }),
    { xmin: 99999, xmax: 0, ymin: 99999, ymax: 0 }
  );
}

function skipOrStop(
  anno: {
    locale: string;
    description: string;
    boundingPoly: { vertices: { x: number; y: number }[] };
  },
  market: Market,
  debug: boolean,
  shortened: boolean
) {
  if (!!market) {
    for (const stopword of STOPWORDS[market]) {
      if (anno.description.toLowerCase().split(" ").includes(stopword)) {
        if (debug && !shortened) console.log(`  ${anno.description} (stopped)`);
        return "stop";
      }
    }

    for (const skipword of SKIPWORDS[market]) {
      if (anno.description.toLowerCase().split(" ").includes(skipword)) {
        if (debug && !shortened) console.log(`  ${anno.description} (skipped)`);
        return "skip";
      }
    }
  }

  return false;
}

export function sortResponse(textAnnotations: Annotation[]): Annotation[] {
  return textAnnotations.slice(1).sort((a, b) => {
    const aMinMax = getMinMaxes(a.boundingPoly.vertices);
    const bMinMax = getMinMaxes(b.boundingPoly.vertices);
    const tLineOverlap =
      Math.min(bMinMax.ymax - aMinMax.ymin, aMinMax.ymax - bMinMax.ymin) /
      Math.max(bMinMax.ymax - bMinMax.ymin, aMinMax.ymax - aMinMax.ymin);

    if (tLineOverlap < 0.4)
      return aMinMax.ymin < bMinMax.ymin
        ? -1
        : aMinMax.ymin > bMinMax.ymin
        ? 1
        : 0;

    return aMinMax.xmin < bMinMax.xmin
      ? -1
      : aMinMax.xmin > bMinMax.xmin
      ? 1
      : 0;
  });
}

function wordEndsAfterPercent(
  xmax: number,
  g_xmax: number,
  g_xmin: number,
  percent: number
) {
  return xmax - g_xmin > (g_xmax - g_xmin) * (percent / 100);
}

function capitaliseWords(str: string) {
  return str
    .toLowerCase()
    .replace(/(^\w{1})|(\s+\w{1})/g, (ch) => ch.toUpperCase());
}
/* #endregion */

export function parseResponse(
  textAnnotations: Annotation[],
  debug = true,
  shortenDebugInfo = true
): ParsedData {
  /* #region  Variables */
  let shortened = shortenDebugInfo;
  let date = null,
    time = null,
    market: Market = null,
    items: ItemData[] = [],
    parsedToY = 0,
    baseAnn = textAnnotations[0],
    { xmax: g_xmax, xmin: g_xmin } = getMinMaxes(baseAnn.boundingPoly.vertices),
    sortedAnnotations = sortResponse(textAnnotations),
    currentName = "",
    currentPrice = null,
    skipThis = false,
    seenPrices: number[] = [],
    seenIndexes: number[] = [],
    type,
    lineHeight,
    currentPriceY,
    currentPriceX,
    isHanging,
    cDescription,
    cAnno,
    lineOverlap,
    cType,
    usedIdx: number[] = [],
    usedPr: number[] = [];
  /* #endregion */

  for (let i = 0; i < sortedAnnotations.length; i++) {
    if (seenIndexes.includes(i) || seenPrices.includes(i)) continue;
    skipThis = false;

    let skipOrStopAnswer = skipOrStop(
      sortedAnnotations[i],
      market,
      debug,
      shortened
    );
    if (skipOrStopAnswer === "stop") {
      break;
    } else if (skipOrStopAnswer === "skip") {
      seenIndexes.push(i);
      continue;
    }

    type = checkAnnotationType(
      sortedAnnotations[i].description,
      sortedAnnotations[i + 1]?.description ?? ""
    );

    if (debug)
      console.log(`"${sortedAnnotations[i].description}" type: ${type}`);

    if (type === "date") {
      date = parseDate(sortedAnnotations[i].description);
      seenIndexes.push(i);
    } else if (type === "time") {
      time = parseTime(sortedAnnotations[i].description);
      seenIndexes.push(i);
    } else if (type === "market") {
      market = checkMarket(
        sortedAnnotations[i].description,
        sortedAnnotations[i + 1]?.description ?? ""
      );
      seenIndexes.push(i);
    } else {
      let { xmax, ymin, ymax } = getMinMaxes(
        sortedAnnotations[i].boundingPoly.vertices
      );

      usedIdx = [i];
      usedPr = [];

      if (
        wordEndsAfterPercent(xmax, g_xmax, g_xmin, 60) ||
        (ymax + ymin) / 2 < parsedToY
      )
        continue;

      if (
        market === "ALDI" &&
        !wordEndsAfterPercent(xmax, g_xmax, g_xmin, 30) &&
        type === "int"
      ) {
        seenIndexes.push(i);
        usedIdx = [];
        continue;
      }

      lineHeight = ymax - ymin;
      currentName += sortedAnnotations[i].description;
      currentPrice = null;
      currentPriceY = 0;
      currentPriceX = 0;
      isHanging = false;
      cDescription = "";

      if (debug) console.log(`Comparing ${sortedAnnotations[i].description}:`);
      for (let j = 0; j < sortedAnnotations.length; j++) {
        if (i === j || seenIndexes.includes(j) || seenPrices.includes(j))
          continue;
        cAnno = sortedAnnotations[j];

        let skipOrStopAnswer = skipOrStop(cAnno, market, debug, shortened);
        if (skipOrStopAnswer === "stop") {
          break;
        } else if (skipOrStopAnswer === "skip") {
          seenIndexes.push(j);
          continue;
        }

        let {
          xmin: cxmin,
          xmax: cxmax,
          ymin: cymin,
          ymax: cymax,
        } = getMinMaxes(cAnno.boundingPoly.vertices);

        if (cymin > ymax + lineHeight * 5) {
          if (debug && !shortened)
            console.log("Too far. Moving on to the next word.");
          break;
        }

        if (cymax < ymin || cymin > ymax) {
          if (debug && !shortened)
            console.log(`  ${cAnno.description} (no overlap)`);
          continue;
        }

        lineOverlap =
          Math.min(cymax - ymin, ymax - cymin) /
          Math.max(cymax - cymin, ymax - ymin);
        if (lineOverlap < 0.4) {
          if (debug && !shortened)
            console.log(`  ${cAnno.description} (overlap too small)`);
          continue;
        }

        if (isHanging) {
          cDescription += cAnno.description;
          isHanging = false;
        } else cDescription = cAnno.description;

        cType = checkAnnotationType(cDescription);

        if (cType === "hanging") {
          isHanging = true;
          if (debug && !shortened) console.log(`  ${cDescription} (hanging)`);
          continue;
        }
        if (cType === "number") {
          if (cxmax < g_xmax * 0.75) {
            currentName += " " + cDescription;
            // Qty x Price of single item
            continue;
          }
          if (
            (cymax < ymin ||
              cymin > ymax ||
              cxmax < xmax ||
              cxmin < currentPriceX) &&
            (currentPrice || cymin > ymin + 2 * lineHeight)
          ) {
            if (debug && !shortened)
              console.log(`  ${cDescription} (not price)`);
            continue;
          }

          if (currentPrice) {
            if (debug && !shortened)
              console.log(`  ${cDescription} (maybe price)`);
            continue;
          }

          usedPr.push(j);
          currentPrice = checkPrice(cDescription);
          currentPriceY = cymin;
          currentPriceX = cxmin;
          parsedToY = Math.max(parsedToY, (cymax + cymin) / 2);
          if (debug) console.log(`  ${cDescription} (price)`);
        }
        if (cType === "text") {
          if (wordEndsAfterPercent(cxmax, g_xmax, g_xmin, 75)) {
            if (debug && !shortened)
              console.log(`  ${cDescription} (not an item)`);
            continue;
          }
          if (
            cymax < ymin ||
            cymin > ymax ||
            (currentPriceY > 0 && cymin > currentPriceY)
          ) {
            if (debug && !shortened)
              console.log(`  ${cDescription} (text no overlap)`);
            continue;
          }
          usedIdx.push(j);
          parsedToY = Math.max(parsedToY, (cymax + cymin) / 2);
          currentName += /[A-Z0-9x£@]/.test(cDescription.charAt(0))
            ? " " + cDescription
            : cDescription;
          if (debug) console.log(`  ${currentName} (current name)`);
        }
        if (cType === "int") {
          if (cxmax > g_xmax * 0.75) {
            if (
              checkAnnotationType(sortedAnnotations[j + 1]?.description) ===
              "int"
            ) {
              cDescription += `.${sortedAnnotations[j + 1]?.description}`;
              let tempType = checkAnnotationType(cDescription);
              if (tempType === "number") {
                if (cxmax < g_xmax * 0.75) {
                  currentName += " " + cDescription;
                  // Single item cost
                  continue;
                }
                if (
                  (cymax < ymin ||
                    cymin > ymax ||
                    cxmax < xmax ||
                    cxmin < currentPriceX) &&
                  (currentPrice || cymin > ymin + 2 * lineHeight)
                ) {
                  if (debug && !shortened)
                    console.log(`  ${cDescription} (not price)`);
                  continue;
                }

                usedPr.push(j, j + 1);
                currentPrice = checkPrice(cDescription);
                currentPriceY = cymin;
                currentPriceX = cxmin;
                parsedToY = Math.max(parsedToY, (cymax + cymin) / 2);
                if (debug) console.log(`  ${cDescription} (price)`);
                continue;
              }
            }
          }
          if (
            cymax < ymin ||
            cymin > ymax ||
            (currentPriceY > 0 && cymin > currentPriceY)
          ) {
            if (debug && !shortened)
              console.log(`  ${cDescription} (text no overlap)`);
            continue;
          }
          usedIdx.push(j);
          parsedToY = Math.max(parsedToY, (cymax + cymin) / 2);
          currentName += " " + cDescription;
          if (debug) console.log(`  ${currentName} (current name)`);
        }
      }

      if (currentPrice) {
        seenPrices.push(...usedPr);
        seenIndexes.push(...usedIdx);
        if (debug && !shortened)
          console.log("Seen indices and prices: ", {
            idx: [...seenIndexes, ...seenPrices].sort((a, b) => a - b),
          });
        skipThis = !checkItemName(currentName);
        if (!skipThis) {
          if (currentPrice.startsWith("-")) {
            const lastItem = items.pop();
            if (!lastItem) continue;
            items.push({ ...lastItem, discount: currentPrice });
            if (debug)
              console.log(
                `Updated ${lastItem.name}   ${lastItem.price}   Discount${currentPrice}`
              );
          } else {
            items.push({
              name: capitaliseWords(currentName),
              price: currentPrice,
            });
            if (debug)
              console.log(
                `Item: ${capitaliseWords(currentName)}   ${currentPrice}`
              );
          }
          currentName = "";
          currentPrice = null;
        }
      } else if (currentName.includes("@") || currentName.includes("x £")) {
        seenIndexes.push(...usedIdx);
        const lastItem = items.pop();
        if (!lastItem) continue;
        lastItem.name += `${
          currentName.includes("@") ? "\n" : " "
        }${currentName}`;
        items.push(lastItem);
        currentName = "";
        currentPrice = null;
        if (debug) console.log(`Updated ${lastItem.name}   ${lastItem.price}`);
      }
    }
  }

  return {
    date,
    market,
    time,
    items,
    total: items.reduce(
      (a, c) => a + parseFloat(c.price) + parseFloat(c.discount ?? "0"),
      0
    ),
  };
}

import React, { useState, useEffect } from "react";

import { Player } from "@lottiefiles/react-lottie-player";

import ParsingIcon from "../components/lottie/parsing.json";
import { GOOGLE_CLOUD_VISION_API_KEY } from "../config/secret";
import { parseResponse } from "../api/VisionParser";
import { deleteFromStorage, tryUploadFromBlobAsync } from "../api/Storage";
import { MONTHS } from "../config/theme";
import { saveBillToFirestoreAsync } from "../api/Firestore";
import { Box, Image, LoadingOverlay, Text } from "@mantine/core";
import ReactJson from "react-json-view";

export default function SecondStep({
  nextStep,
  prevStep,
  imgStorage,
  imageGlobal,
}: {
  nextStep: () => void;
  prevStep: () => void;
  imgStorage: { url: string; path: string };
  imageGlobal: File | undefined;
}) {
  const [googleResponse, setGoogleResponse] = useState<{
    date: string | null;
    market: string | null;
    items: { discount?: string; name: string; price: string }[];
    time: string | null;
    total: number;
  }>();
  const [isParsing, setIsParsing] = useState(true);
  const [responseFromGoogle, setResponseFromGoogle] = useState();

  useEffect(() => {
    if (!!googleResponse) return;
    (async function submitToGoogle() {
      try {
        let body = JSON.stringify({
          requests: [
            {
              features: [
                { type: "TEXT_DETECTION", maxResults: 5 },
                // { type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
              ],
              image: {
                source: {
                  imageUri: imgStorage.url,
                },
              },
            },
          ],
        });
        let response = await fetch(
          "https://vision.googleapis.com/v1/images:annotate?key=" +
            GOOGLE_CLOUD_VISION_API_KEY,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "POST",
            body,
          }
        );
        let responseJson = await response.json();
        if (!responseJson) throw new Error(`Bad responseJson: ${responseJson}`);
        console.log(responseJson);
        let data = responseJson.responses[0].textAnnotations;
        const parsedResponse = parseResponse(data);

        setResponseFromGoogle(data);
        setGoogleResponse(parsedResponse);
        deleteFromStorage(imgStorage.path);
      } catch (error) {
        console.warn(error);
        setIsParsing(false);
        deleteFromStorage(imgStorage.path);
      }
    })();
  }, []);

  useEffect(() => {
    if (!googleResponse) return;
    setIsParsing(false);

    const { date, time, market } = googleResponse;

    if (!date || !time || !market) {
      console.warn(
        `Could not fully analyse receipt! [date: ${date}, time: ${time}, market: ${market}]`
      );
    }

    // TO-DO: Allow users specify market if market == null
    const newPath = `${market ?? "LIDL"}--${
      !date
        ? MONTHS[new Date().getUTCMonth()]
        : MONTHS[parseInt(date.substring(3, 5)) - 1]
    }-${!date ? new Date().getUTCDate() : date.substring(0, 2)}--${
      !time ? new Date().getTime() : time.substring(0, 5)
    }`;

    if (!imageGlobal) {
      console.log("Could not load image from first step");
      return;
    }
    // tryUploadFromBlobAsync(URL.createObjectURL(imageGlobal), newPath);

    // (async function uploadToFirestore(firestorePath) {
    //   try {
    //     await saveBillToFirestoreAsync(firestorePath, googleResponse);
    //     console.log(`${firestorePath} saved to Firestore`);
    //   } catch (e) {
    //     console.error("Error adding document: ", e);
    //   }
    // })(newPath);
  }, [googleResponse]);

  return (
    <Box>
      <div>Please wait white Google Vision API is parsing the image</div>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: 50,
        }}
      >
        <div
          style={{
            width: 400,
            marginLeft: "auto",
            marginRight: isParsing ? "auto" : 25,
            position: "relative",
          }}
        >
          <LoadingOverlay
            visible={isParsing}
            radius="md"
            loader={
              <>
                <Player
                  autoplay
                  loop
                  src={ParsingIcon}
                  style={{ height: "300px", width: "300px" }}
                />
                <Text size="md">Parsing the image...</Text>
              </>
            }
          />
          {!!imageGlobal && (
            <Image
              radius="md"
              src={URL.createObjectURL(imageGlobal)}
              alt="Bill preview"
            />
          )}
        </div>
        {!isParsing && (
          <Box
            style={{
              marginLeft: 25,
              marginRight: "auto",
            }}
          >
            {!!responseFromGoogle && !isParsing && (
              <Box
                style={{
                  minWidth: 400,
                  textAlign: "start",
                  fontSize: 18,
                  marginBottom: 25,
                }}
              >
                <Text weight="bold">Google response</Text>
                <ReactJson
                  src={responseFromGoogle}
                  theme="tomorrow"
                  collapsed={true}
                />
              </Box>
            )}
            {!!googleResponse && !isParsing && (
              <Box
                style={{
                  minWidth: 400,
                  textAlign: "start",
                  fontSize: 18,
                }}
              >
                <Text weight="bold">Parsed data</Text>
                <ReactJson
                  src={googleResponse}
                  theme="tomorrow"
                  collapsed={true}
                  enableClipboard={false}
                  onDelete={false}
                  onAdd={false}
                  onEdit={false}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

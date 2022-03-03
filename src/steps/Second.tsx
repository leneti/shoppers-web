import React, { useState, useEffect } from "react";

import { Player } from "@lottiefiles/react-lottie-player";
import ReactJson from "react-json-view";
import { Box, Button, Group, Image, LoadingOverlay, Text } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { Cross1Icon } from "@modulz/radix-icons";

import { ParsedData, parseResponse, sortResponse } from "../api/VisionParser";
import { deleteFromStorage, tryUploadFromBlobAsync } from "../api/Storage";
import { MONTHS } from "../config/theme";
import { saveBillToFirestoreAsync } from "../api/Firestore";
import ParsingIcon from "../components/lottie/parsing.json";

const DEV = false;

export default function SecondStep({
  nextStep,
  prevStep,
  setGoogleResGlobal,
  setFirestorePathGlobal,
  imgStorage,
  imageGlobal,
}: {
  nextStep: () => void;
  prevStep: () => void;
  setGoogleResGlobal: React.Dispatch<
    React.SetStateAction<ParsedData | undefined>
  >;
  setFirestorePathGlobal: React.Dispatch<React.SetStateAction<string>>;
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
  const [sortedResponse, setSortedResponse] = useState<
    {
      locale: string;
      description: string;
      boundingPoly: { vertices: { x: number; y: number }[] };
    }[]
  >();
  const [fPath, setFPath] = useState("");
  const notifications = useNotifications();

  useEffect(() => {
    if (!!googleResponse) return;
    (async function submitToGoogle(tryNo: number) {
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
        if (!process.env.REACT_APP_GOOGLE_CLOUD_VISION_API_KEY) {
          console.log("Could not find the VisionAPI key");
          return;
        }
        let response = await fetch(
          "https://vision.googleapis.com/v1/images:annotate?key=" +
            process.env.REACT_APP_GOOGLE_CLOUD_VISION_API_KEY,
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
        if (responseJson.responses[0].hasOwnProperty("error")) {
          if (tryNo <= 3) {
            console.warn(
              "responseJson error: ",
              responseJson.responses[0].error.message
            );
            console.log(`Trying to call Vision API again. Try number ${tryNo}`);
            // await submitToGoogle(++tryNo);
            setTimeout(() => submitToGoogle(++tryNo), 1000);
            return;
          }
        }
        let data = responseJson.responses[0].textAnnotations;
        if (DEV) setSortedResponse(sortResponse(data));
        const parsedResponse = parseResponse(data, DEV, false); // PROD: parseResponse(data, false)

        if (DEV) setResponseFromGoogle(data);
        setGoogleResponse(parsedResponse);
        setGoogleResGlobal(parsedResponse);
        deleteFromStorage(imgStorage.path);
      } catch (error) {
        console.warn(error);
        setIsParsing(false);
        deleteFromStorage(imgStorage.path);
      }
    })(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!googleResponse) return;
    setIsParsing(false);

    const { date, time, market } = googleResponse;

    if (!date || !time || !market) {
      console.warn(
        `Could not fully analyse receipt! [date: ${date}, time: ${time}, market: ${market}]`
      );
      notifications.showNotification({
        title: "Incomplete parsing",
        message: `Could not fully analyse receipt! [date: ${date}, time: ${time}, market: ${market}]`,
        color: "red",
        icon: <Cross1Icon />,
      });
    }

    // TO-DO: Allow users specify market if market == null
    const newPath = `${market ?? ""}--${
      !date
        ? MONTHS[new Date().getUTCMonth()]
        : MONTHS[parseInt(date.substring(3, 5)) - 1]
    }-${!date ? new Date().getUTCDate() : date.substring(0, 2)}--${
      !time ? new Date().getTime() : time.substring(0, 5)
    }`;
    setFirestorePathGlobal(newPath);
    if (!DEV) uploadToFirestore(newPath);
    else setFPath(newPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleResponse]);

  async function uploadToFirestore(firestorePath: string) {
    if (!imageGlobal) {
      console.log("Could not load image from first step");
      return;
    }
    try {
      tryUploadFromBlobAsync(URL.createObjectURL(imageGlobal), firestorePath);
      await saveBillToFirestoreAsync(firestorePath, googleResponse);
      console.log(`${firestorePath} saved to Firestore`);
      nextStep();
    } catch (e) {
      console.error("Error adding document: ", e);
      notifications.showNotification({
        title: "Error adding document",
        message: "Check console log for details.",
        color: "red",
        icon: <Cross1Icon />,
      });
    }
  }

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
            marginRight: isParsing || !DEV ? "auto" : 25,
            position: "relative",
          }}
        >
          <LoadingOverlay
            visible={isParsing || !DEV}
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
        {!isParsing && DEV && (
          <Box
            style={{
              marginLeft: 25,
              marginRight: "auto",
            }}
          >
            {!!responseFromGoogle && (
              <Box
                style={{
                  minWidth: 500,
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
            {!!sortedResponse && (
              <Box
                style={{
                  minWidth: 500,
                  textAlign: "start",
                  fontSize: 18,
                  marginBottom: 25,
                }}
              >
                <Text weight="bold">Sorted response</Text>
                <ReactJson
                  src={sortedResponse}
                  theme="tomorrow"
                  collapsed={true}
                  enableClipboard={false}
                  onDelete={false}
                  onAdd={false}
                  onEdit={false}
                />
              </Box>
            )}
            {!!googleResponse && (
              <Box
                style={{
                  minWidth: 500,
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
      {DEV && (
        <Group style={{ marginBottom: 50 }} position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Upload another
          </Button>
          <Button color="yellow" onClick={() => uploadToFirestore(fPath)}>
            Next step
          </Button>
        </Group>
      )}
    </Box>
  );
}

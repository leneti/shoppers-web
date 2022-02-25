import React, { useState, useEffect } from "react";

import { Player } from "@lottiefiles/react-lottie-player";

import ParsingIcon from "../components/lottie/parsing.json";
import { GOOGLE_CLOUD_VISION_API_KEY } from "../config/secret";
import { parseResponse } from "../api/VisionParser";
import {
  deleteFromStorage,
  tryUploadFromBlobAsync,
  uploadFromBlobAsync,
} from "../api/Storage";
import { MONTHS } from "../config/theme";
import { saveBillToFirestoreAsync } from "../api/Firestore";

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

  useEffect(() => {
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
        let data = responseJson.responses[0].textAnnotations;
        const parsedResponse = parseResponse(data);
        console.log(parsedResponse);
        setGoogleResponse(parsedResponse);
        deleteFromStorage(imgStorage.path);
      } catch (error) {
        console.warn(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!googleResponse) return;

    const { date, time, market } = googleResponse;

    if (!date || !time || !market) {
      console.warn(
        `Could not fully analyse receipt! Only found: [date: ${date}, time: ${time}, market: ${market}]`
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
    tryUploadFromBlobAsync(URL.createObjectURL(imageGlobal), newPath);

    (async function uploadToFirestore(firestorePath) {
      try {
        await saveBillToFirestoreAsync(firestorePath, googleResponse);
        console.log(`${firestorePath} saved to Firestore`);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    })(newPath);
  }, [googleResponse]);

  return <div>Wait for Google Vision API to finish parsing the image</div>;
}

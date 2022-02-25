import React, { useState, useEffect } from "react";

import { Player } from "@lottiefiles/react-lottie-player";

import ParsingIcon from "../components/lottie/parsing.json";
import { GOOGLE_CLOUD_VISION_API_KEY } from "../config/secret";

export default function SecondStep({
  nextStep,
  prevStep,
  imgStorage,
}: {
  nextStep: () => void;
  prevStep: () => void;
  imgStorage: { url: string; path: string };
}) {
  useEffect(() => {
    (async () => {
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
      } catch (error) {
        console.warn(error);
      }
    })();
  }, []);

  return <div>Wait for Google Vision API to finish parsing the image</div>;
}

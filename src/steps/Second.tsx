import React, { useState, useEffect } from "react";

import { Player } from "@lottiefiles/react-lottie-player";

import ParsingIcon from "../components/lottie/parsing.json";

export default function SecondStep({
  nextStep,
  prevStep,
  imgStorage,
}: {
  nextStep: () => void;
  prevStep: () => void;
  imgStorage: { url: string; path: string };
}) {
  const submitToGoogle = async () => {};

  return <div>Wait for Google Vision API to finish parsing the image</div>;
}

import { useState } from "react";

import { firebaseConfig } from "./config/secret";
import { initializeApp } from "firebase/app";
import { Box, Stepper } from "@mantine/core";

import "./App.css";
import FirstStep from "./steps/First";
import SecondStep from "./steps/Second";

initializeApp(firebaseConfig);

function App() {
  const [active, setActive] = useState(0);
  const [imgStorage, setUrlAndPath] = useState<{ url: string; path: string }>({
    url: "",
    path: "",
  });
  const [imageGlobal, setImageGlobal] = useState<File>();

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <div className="App">
      <Box style={{ width: "75%" }}>
        <Stepper
          color="yellow"
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
        >
          <Stepper.Step
            label="Fist step"
            description="Upload bill picture"
            allowStepSelect={active > 0}
          >
            <FirstStep
              nextStep={nextStep}
              prevStep={prevStep}
              setUrlAndPath={setUrlAndPath}
              setImageGlobal={setImageGlobal}
            />
          </Stepper.Step>
          <Stepper.Step
            label="Second step"
            description="Image parsing"
            allowStepSelect={active > 1}
          >
            <SecondStep
              nextStep={nextStep}
              prevStep={prevStep}
              imgStorage={imgStorage}
              imageGlobal={imageGlobal}
            />
          </Stepper.Step>
          <Stepper.Step
            label="Final step"
            description="Separate items"
            allowStepSelect={active > 2}
          >
            Separate items from the common list
          </Stepper.Step>
          <Stepper.Completed>
            Visit Splitwise to settle expenses
          </Stepper.Completed>
        </Stepper>
      </Box>
    </div>
  );
}

export default App;

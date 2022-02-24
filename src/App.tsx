import { useState } from "react";
import "./App.css";
import { firebaseConfig } from "./config/secret";
import { initializeApp } from "firebase/app";

import { Box, Stepper, Button, Group } from "@mantine/core";
import FirstStep from "./steps/First";

initializeApp(firebaseConfig);

function App() {
  const [active, setActive] = useState(0);

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
            <FirstStep nextStep={nextStep} prevStep={prevStep} />
          </Stepper.Step>
          <Stepper.Step
            label="Second step"
            description="Image parsing"
            allowStepSelect={active > 1}
          >
            Wait for Google Vision API to finish parsing the image
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

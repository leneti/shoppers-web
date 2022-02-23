import { useState } from "react";
import "./App.css";
import { Box, Stepper, Button, Group } from "@mantine/core";

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
            Upload a picture of the bill
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

        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button color="yellow" onClick={nextStep}>
            {active > 1 ? "Finish" : "Next step"}
          </Button>
        </Group>
      </Box>
    </div>
  );
}

export default App;

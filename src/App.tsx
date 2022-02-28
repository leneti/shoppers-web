import { useState } from "react";

import { firebaseConfig } from "./config/secret";
import { initializeApp } from "firebase/app";
import { Box, Stepper } from "@mantine/core";

import "./App.css";
import FirstStep from "./steps/First";
import SecondStep from "./steps/Second";
import ThirdStep from "./steps/Third";

initializeApp(firebaseConfig);

const DEV = true;
const mockGoogleResponse = `{"date":"06/02/22","market":"ALDI","time":"14:00:36","items":[{"name":"CHEDDAR GRATED","price":"2.49"},{"name":"CHICKEN FILLETS","price":"3.49"},{"name":"GRANOLA 1KG","price":"1.45"},{"name":"BANANAS 5PK","price":"0.69"},{"name":"CARROT 1KG","price":"0.40"},{"name":"KIWI FRUIT","price":"0.59"},{"name":"LETTUCE LITTLE GEM","price":"0.49"},{"name":"PRINGLES","price":"1.65"},{"name":"CUCUMBER","price":"0.43"},{"name":"E/E SPAGHETTI 500G","price":"0.20"},{"name":"TEA FRUIT& HERB","price":"0.75"},{"name":"BAGELS PLAIN 5PK","price":"0.79"},{"name":"BREAD WHT TOASTIE","price":"0.49"},{"name":"PINEAPPLE","price":"0.75"},{"name":"NECTARINES","price":"0.95"},{"name":"BUTTER SALTED 250G","price":"1.48"},{"name":"STOCK CUBES 120G","price":"0.35"},{"name":"STOCK CUBES 120G","price":"0.35"},{"name":"STOCK CUBES 120G","price":"0.35"},{"name":"BRAEBURN APPLES","price":"1.19"},{"name":"SALMON SMKD SCO","price":"3.99"},{"name":"TORILLA WRAP PLAIN","price":"0.75"},{"name":"FLIX N MIX","price":"1.49"},{"name":"CHOCO E/E MILK","price":"0.30"},{"name":"CHOCO E/E MILK","price":"0.30"},{"name":"YOGURT F FREE 450G","price":"0.75"},{"name":"YOGURT F FREE 450G","price":"0.75"},{"name":"YOGURT F FREE 450G","price":"0.75"}],"total":28.410000000000007}`;

function App() {
  const [active, setActive] = useState(0);
  const [imgStorage, setUrlAndPath] = useState<{ url: string; path: string }>({
    url: "",
    path: "",
  });
  const [imageGlobal, setImageGlobal] = useState<File>();
  const [googleResGlobal, setGoogleResGlobal] = useState<{
    date: string | null;
    market: string | null;
    items: { discount?: string; name: string; price: string }[];
    time: string | null;
    total: number;
  }>();

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
            allowStepSelect={false}
          >
            <SecondStep
              nextStep={nextStep}
              prevStep={prevStep}
              setGoogleResGlobal={setGoogleResGlobal}
              imgStorage={imgStorage}
              imageGlobal={imageGlobal}
            />
          </Stepper.Step>
          <Stepper.Step
            label="Final step"
            description="Separate items"
            allowStepSelect={active > 2 || DEV}
          >
            <ThirdStep
              nextStep={nextStep}
              prevStep={prevStep}
              googleResGlobal={
                DEV ? JSON.parse(mockGoogleResponse) : googleResGlobal
              }
            />
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

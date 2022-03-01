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
const mockGoogleResponse = `{"date":"06/02/22","market":"ALDI","time":"14:00:36","items":[{"name":"Cheddar Grated","price":"2.49"},{"name":"Chicken Fillets","price":"3.49"},{"name":"Granola 1kg","price":"1.45"},{"name":"Bananas 5pk","price":"0.69"},{"name":"Carrot 1kg","price":"0.40"},{"name":"Kiwi Fruit","price":"0.59"},{"name":"Lettuce Little Gem","price":"0.49"},{"name":"Pringles","price":"1.65"},{"name":"Cucumber","price":"0.43"},{"name":"E/e Spaghetti 500g","price":"0.20"},{"name":"Tea Fruit& Herb","price":"0.75"},{"name":"Bagels Plain 5pk","price":"0.79"},{"name":"Bread Wht Toastie","price":"0.49"},{"name":"Pineapple","price":"0.75"},{"name":"Nectarines","price":"0.95"},{"name":"Butter Salted 250g","price":"1.48"},{"name":"Stock Cubes 120g","price":"0.35"},{"name":"Stock Cubes 120g","price":"0.35"},{"name":"Stock Cubes 120g","price":"0.35"},{"name":"Braeburn Apples","price":"1.19"},{"name":"Salmon Smkd Sco","price":"3.99"},{"name":"Torilla Wrap Plain","price":"0.75"},{"name":"Flix N Mix","price":"1.49"},{"name":"Choco E/e Milk","price":"0.30"},{"name":"Choco E/e Milk","price":"0.30"},{"name":"Yogurt F Free 450g","price":"0.75"},{"name":"Yogurt F Free 450g","price":"0.75"},{"name":"Yogurt F Free 450g","price":"0.75"}],"total":28.410000000000007}`;

function App() {
  const [active, setActive] = useState(0);

  const [imgStorage, setUrlAndPath] = useState({
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
  const [allListsGlobal, setAllListsGlobal] = useState<{
    common: { discount?: string; name: string; price: string }[];
    dom: { discount?: string; name: string; price: string }[];
    emilija: { discount?: string; name: string; price: string }[];
  }>({ common: [], dom: [], emilija: [] });

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
                DEV && !googleResGlobal
                  ? JSON.parse(mockGoogleResponse)
                  : googleResGlobal
              }
              setAllListsGlobal={setAllListsGlobal}
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

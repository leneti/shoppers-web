import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MantineProvider } from "@mantine/core";

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        colorScheme: "dark",
        colors: {
          primary: [
            "#fffbeb",
            "#fef3c7",
            "#fde68a",
            "#fcd34d",
            "#fbbf24",
            "#f59e0b",
            "#d97706",
            "#b45309",
            "#92400e",
            "#78350f",
          ],
          background: ["#404040", "#4a4a4a", "#363636", "#262626", "#595959"],
          backgroundLight: [
            "#F6F6F6",
            "#FFF",
            "#ECECEC",
            "#DCDCDC",
            "#FFF",
            "#6F6F6F",
          ],
        },
      }}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

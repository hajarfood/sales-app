import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

/* import { TempoDevtools } from 'tempo-devtools'; [deprecated] */
/* TempoDevtools.init() [deprecated] */ const basename = import.meta.env
  .BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode className=" w-[1292px] h-[1242.4000244140625px]">
    <BrowserRouter basename={basename}>
      <App className="flex" />
    </BrowserRouter>
  </React.StrictMode>,
);


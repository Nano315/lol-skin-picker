import React from "react";
import ReactDOM from "react-dom/client";
import AppShell from "./app/AppShell";
import "./styles/base.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>
);

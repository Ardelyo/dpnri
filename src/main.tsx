import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initFingerprint } from "./lib/fingerprint";

// Fire-and-forget — non-blocking, invisible to user
initFingerprint();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

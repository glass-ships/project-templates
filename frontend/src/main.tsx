import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import NotFound from "@/pages/NotFound";
import Testbed from "@/pages/Testbed";
import TestNexus from "@/pages/TestNexus";
import "@/global/icons"; // Ensure icons are loaded
import TestModal from "./pages/TestModal";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Testbed />} />
        <Route path="/nexus" element={<TestNexus />} />
        <Route path="/modal" element={<TestModal />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

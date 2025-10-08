import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Home from "@/pages/Home";
import TestNexus from "@/pages/TestNexus";
import NotFound from "@/pages/NotFound";
import Testbed from "@/pages/Testbed";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Testbed />} />
        <Route path="/nexus" element={<TestNexus />} />
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/testbed" element={<Testbed />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

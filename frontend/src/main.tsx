import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import Navbar from "@/components/Navbar";
import NotFound from "@/pages/NotFound";
import Testbed from "@/pages/Testbed";
import TestInfiniteScroll from "@/pages/TestInfiniteScroll";
import TestNexus from "@/pages/TestNexus";
import "@/global/icons"; // Ensure icons are loaded

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <>
              <Navbar />
              <Outlet />
            </>
          }
        >
          <Route path="/" element={<Testbed />} />
          <Route path="/infinite-scroll" element={<TestInfiniteScroll />} />
          <Route path="/nexus" element={<TestNexus />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

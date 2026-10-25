import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteLayout from "./layout/SiteLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./pages/LandingPage";
import DemoPage from "./pages/DemoPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";

// Add new pages as another <Route> inside the layout.
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="demo" element={<DemoPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

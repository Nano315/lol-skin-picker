import { createHashRouter } from "react-router-dom";
import Home from "@/pages/Home/Home";
import Settings from "@/pages/Settings/Settings";

export const router = createHashRouter([
  { path: "/", element: <Home /> },
  { path: "/settings", element: <Settings /> },
]);

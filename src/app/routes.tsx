import { createHashRouter } from "react-router-dom";
import Home from "@/pages/Home/Home";
import Rooms from "@/pages/Rooms/Rooms";
import Settings from "@/pages/Settings/Settings";

export const router = createHashRouter([
  { path: "/", element: <Home /> },
  { path: "/rooms", element: <Rooms /> },
  { path: "/settings", element: <Settings /> },
]);

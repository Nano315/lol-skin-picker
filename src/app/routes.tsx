import { createHashRouter } from "react-router-dom";
import Home from "@/pages/Home/Home";
import Settings from "@/pages/Settings/Settings";
import { RoomsPage } from "@/pages/Rooms/Rooms";

export const router = createHashRouter([
  { path: "/", element: <Home /> },
  { path: "/rooms", element: <RoomsPage /> },
  { path: "/settings", element: <Settings /> },
]);

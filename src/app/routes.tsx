import { createHashRouter } from "react-router-dom";
import Home from "@/pages/Home/Home";
import Settings from "@/pages/Settings/Settings";
import { RoomsPage } from "@/pages/Rooms/Rooms";
import PriorityManager from "@/pages/Priority/PriorityManager";
import { Layout } from "./Layout";

export const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/rooms", element: <RoomsPage /> },
      { path: "/priority", element: <PriorityManager /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
]);

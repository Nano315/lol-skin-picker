import { createHashRouter } from "react-router-dom";
import Solo from "@/pages/Solo/Solo";
import Settings from "@/pages/Settings/Settings";
import { PremadePage } from "@/pages/Premade/Premade";
import LibraryManager from "@/pages/Library/LibraryManager";
import { Layout } from "./Layout";

export const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Solo /> },
      { path: "/premade", element: <PremadePage /> },
      { path: "/library", element: <LibraryManager /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
]);

import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

export default function AppShell() {
  return <RouterProvider router={router} />;
}

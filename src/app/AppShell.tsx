import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useSyncPrefsWithBackend } from "@/features/hooks/useSyncPrefsWithBackend";

export default function AppShell() {
  useSyncPrefsWithBackend();
  return <RouterProvider router={router} />;
}

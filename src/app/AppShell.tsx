import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useSyncPrefsWithBackend } from "@/features/hooks/useSyncPrefsWithBackend";
import MascotsLayer from "@/components/overlays/MascotsLayer";

export default function AppShell() {
  useSyncPrefsWithBackend();
  return (<div><RouterProvider router={router}/><MascotsLayer/></div>);
}

// src/app/Layout.tsx
import { Outlet } from "react-router-dom";
import { InvitationHandler } from "./InvitationHandler";
import Background from "@/components/ui/Background";
import WindowTitleBar from "@/components/layout/WindowTitleBar";

/**
 * Root layout. The document itself does not scroll — the titlebar stays
 * pinned at the top while only the inner flex-1 column scrolls.
 */
export function Layout() {
  return (
    <>
      <Background />
      <div className="flex h-screen flex-col">
        <WindowTitleBar />
        <div className="relative z-10 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
      <InvitationHandler />
    </>
  );
}

// src/app/Layout.tsx
import { Outlet } from "react-router-dom";
import { InvitationHandler } from "./InvitationHandler";

/**
 * Root layout that wraps all pages.
 * Contains global UI elements like the InvitationHandler.
 */
export function Layout() {
  return (
    <>
      <Outlet />
      <InvitationHandler />
    </>
  );
}

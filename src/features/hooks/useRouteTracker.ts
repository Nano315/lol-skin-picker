import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackScreenView } from "../analytics/tracker";

const ROUTE_NAMES: Record<string, string> = {
  "/": "Solo",
  "/premade": "Premade",
  "/library": "Library",
  "/settings": "Settings",
};

export function useRouteTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    const name = ROUTE_NAMES[pathname] ?? pathname;
    trackScreenView(name);
  }, [pathname]);
}

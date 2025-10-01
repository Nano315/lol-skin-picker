import { createHashRouter } from "react-router-dom";
import Home from "@/pages/Home/Home";

export const router = createHashRouter([{ path: "/", element: <Home /> }]);

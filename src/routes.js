import React from "react";
import HomeOne from "./pages/homeOne";
import HomeTwo from "./pages/homeTwo";

// const HomeTwo = React.lazy(() => import("./pages/homeTwo"))

export default[
    { path: "/", Component: HomeOne },
    { path: "/hometwo", Component: HomeTwo }
]
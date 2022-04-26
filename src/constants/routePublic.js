import * as links from "./links";
import React from "react";
import Login from "../modules/Login/Login";

const arrayRoutesPublic = [
    {
        path: links.LOGIN,
        component: () => <Login />,
        exact: false,
    },
];

export default arrayRoutesPublic;

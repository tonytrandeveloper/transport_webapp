import Home from "../components/Home/Home";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import AccountManager from "../components/Account/AccountManager";
import PersonManager from "../components/Person/PersonManager";

function PersonRoute(props) {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route path={path}>
        <PersonManager />
      </Route>
    </Switch>
  );
}

export default PersonRoute;

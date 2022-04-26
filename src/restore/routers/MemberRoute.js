import Home from "../components/Home/Home";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import MemberManager from "../components/Member/MemberManager";
import MemberNew from "../components/Member/MemberNew";

function MemberManagerRoute(props) {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route path={path}>
        <MemberManager />
      </Route>
    </Switch>
  );
}

function MemberNewRoute(props) {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route path={path}>
        <MemberNew />
      </Route>
    </Switch>
  );
}


export default {
  MemberManagerRoute,
  MemberNewRoute
};

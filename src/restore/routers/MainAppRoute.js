import React, { Suspense, lazy } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import LayoutMenu from "../components/Layout/LayoutMenu";
import PrivateRoute from "../../PrivateRoute";
const Home = lazy(() => import("./HomeRoute"));
const OrderManager = lazy(() => import("./OrderRoute"));
const ProductManager = lazy(() => import("./ProductRoute"));
const TypeProductManager = lazy(() => import("./TypeProductRoute"));
const MaterialManager = lazy(() => import("./MaterialRoute"));
const ImportMaterial = lazy(() => import("./ImportMaterialRoute"));
const ExportMaterial = lazy(() => import("./ExportMaterialRoute"));
const TableManager = lazy(() => import("./TableRoute"));
const AccountManager = lazy(() => import("./AccountRoute"));
const PersonManager = lazy(() => import("./PersonRoute"));

const {
  MemberManagerRoute,
  MemberNew
} = lazy(() => import("./MemberRoute"));


function MainAppRoute(props) {
  return (
    <LayoutMenu>
      <Suspense fallback={<div>Loading...</div>}>
        {/*<Switch>*/}
        {/*  <PrivateRoute component={Home} exact path="/" />*/}
        {/*  <PrivateRoute component={OrderManager} exact path="/order" />*/}
        {/*  <PrivateRoute component={ProductManager} exact path="/product" />*/}
        {/*  <PrivateRoute component={TypeProductManager} exact path="/typeproduct" />*/}
        {/*  <PrivateRoute component={MaterialManager} exact path="/material" />*/}
        {/*  <PrivateRoute component={ImportMaterial} path="/material/import" />*/}
        {/*  <PrivateRoute component={ExportMaterial} path="/material/export" />*/}
        {/*  <PrivateRoute component={TableManager} exact path="/store/table" />*/}

        {/*  <PrivateRoute component={MemberManagerRoute} exact path="/member" />*/}
        {/*  <PrivateRoute component={MemberNew} exact path="/member/new" />*/}



        {/*  <PrivateRoute component={AccountManager} exact path="/account" />*/}
        {/*  <PrivateRoute component={PersonManager} exact path="/person" />*/}
        {/*  /!* <Route component={ErrorNotFound} path="*" /> *!/*/}
        {/*</Switch>*/}
      </Suspense>
    </LayoutMenu>
  );
}

export default MainAppRoute;

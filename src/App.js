import React, {Suspense} from 'react';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import PropTypes from "prop-types";
import {compose} from "redux";
import {connect} from "react-redux";
import arrayRoutesPublic from "./constants/routePublic";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import MainAppRoutes from './restore/routers/MainAppRoute';
import RoutesMap from "./RoutesMap";
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const {

    } = this.props;
    return (
      <div>
        <Switch>
          <div>
            <div>
              {arrayRoutesPublic.map(item => {
                return <PublicRoute
                  path={item.path}
                  exact={item.exact}
                  component={item.component}
                />;
              })}
              <RoutesMap/>
              {/*<PrivateRoute component={MainAppRoutes} path="*" exact />*/}
            </div>
          </div>
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
)(App);

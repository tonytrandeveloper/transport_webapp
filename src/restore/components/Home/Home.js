import React from "react";
import PropTypes from "prop-types";
import {compose} from "redux";
import {connect} from "react-redux";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      t, classes
    } = this.props;
    return (
      <div>
        Home
      </div>
    )
  }
}

Home.defaultProps = {

}

Home.propTypes = {
  classes: PropTypes.object.isRequired
}


export default compose(connect(null, null)(Home));

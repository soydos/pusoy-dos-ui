import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { handleLogin } from '../../actions/auth';

const Login = ({redirect}) => {

  redirect();

  return <div>
    <h3>Logging in...</h3>
  </div>;
};

Login.propTypes = {
  redirect: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  redirect: () => dispatch(handleLogin)
});

export default connect(
  null,
  mapDispatchToProps
)(Login);

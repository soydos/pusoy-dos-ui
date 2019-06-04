import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import css from './Logout.sass';
import { logout } from '../../actions/auth.js';

const Logout = ({loggedIn, onLogout}) => {

    return loggedIn ?
      (<span className={css.buttonWrapper}>
        <button onClick={onLogout}>log out</button>
      </span>) :
      null;
};

Logout.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    loggedIn: state.auth
});

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(logout)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Logout);

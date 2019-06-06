import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import css from './Account.sass';
import { logout, login } from '../../actions/auth.js';

const Account = ({loggedIn, onLogout, onLogin}) => {

    return loggedIn ?
      <span className={css.buttonWrapper}>
        <button onClick={onLogout}>log out</button>
      </span> :
      <span className={css.buttonWrapper}>
        <button onClick={onLogin}>log in</button>
      </span>;
};

Account.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    loggedIn: state.auth
});

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(logout),
  onLogin: () => dispatch(login)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Account);

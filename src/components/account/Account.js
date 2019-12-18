import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import css from './Account.sass';
import { logout, beginLogin } from '../../actions/auth.js';

const Account = ({loggedIn, onLogout, onLogin}) => {

    return loggedIn ?
      <span className={css.buttonWrapper}>
        <button onClick={onLogout}>Log out</button>
      </span> :
      <span className={css.buttonWrapper}>
        <button onClick={onLogin}>Log in</button>
      </span>;
};

Account.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    loggedIn: state.auth.loggedIn
});

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(logout),
  onLogin: () => dispatch(beginLogin)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Account);

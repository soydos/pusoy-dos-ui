import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import css from './PageHeader.sass';
import Account from "../../components/account/Account";
import logo from "../../../assets/images/logo-landscape.svg";

const PageHeader = ({loggedIn}) => {
    const [displayHeaderGraphics, setDisplayHeaderGraphics]
        = useState(loggedIn 
            || window.location.pathname !== "/");
    useEffect(() => {
        const rerender = setInterval(() => {
          const displayGraphics = loggedIn 
              || window.location.pathname !== "/";

          setDisplayHeaderGraphics(displayGraphics);
        }, 10);

        return () => {
            clearInterval(rerender);
        };
    });
    return (<header>
        { displayHeaderGraphics && 
            <Link to="/" className={css.logo}>
            <img src={logo}/>
        </Link> }
        <Account />
        { displayHeaderGraphics && 
            <span className={css.tagline}>
              The Pu is silent
            </span>
        }
    </header>);
};

PageHeader.propTypes = {
    loggedIn: PropTypes.bool
};

const mapStateToProps = state => ({
    loggedIn: state.auth.loggedIn
});

export default connect(
  mapStateToProps,
)(PageHeader);

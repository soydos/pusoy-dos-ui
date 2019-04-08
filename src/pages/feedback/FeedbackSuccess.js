import React from 'react';
import css from './Feedback.sass';
import {Link} from "react-router-dom";

const FeedbackSuccess = () => {

    return (<div className={css.feedback}>
        <h2>Thanks for your feedback!</h2>
        <div>
            <Link to="/">Return to game.</Link>
        </div>
    </div>);
};

export default FeedbackSuccess;

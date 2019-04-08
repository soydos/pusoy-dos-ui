import React from 'react';
import css from './Feedback.sass';

const Feedback = () => {

    return (<div className={css.feedback}>
        <p>We'd love to hear from you.
            If you have a feature request,
           a bug report, or just want to say hi, 
            please get in touch!</p>
        <form name="feedback" method="POST" data-netlify="true">
            <p>
                <label>Name:</label><br/>
                <input type="text" name="name" />
            </p>
            <p>
                <label>Email:</label><br/>
                <input type="email" name="email" />
            </p>
            <p>
                <label>Feedback:</label><br/>
                <textarea rows="8" name="message"></textarea>
            </p>
            <p>
                <button type="submit">Send</button>
            </p>
        </form>
    </div>);
};

export default Feedback;

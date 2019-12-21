import React from 'react';
import { Link } from "react-router-dom";

const NotFound = () => {
  return (<div>
    <h3>There's nothing here!</h3>   

    <Link to="/">Go back to lobby</Link>
  </div>);  
};

export default NotFound;

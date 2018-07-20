import React from "react";
import {Link} from 'react-router-dom';

export default class NotFound extends React.Component {
  render() {
    return (
      <div>
        <p>Not Found</p>
        <Link to="/" replace>Zurück zum Login</Link>
      </div>
    );
  }
};

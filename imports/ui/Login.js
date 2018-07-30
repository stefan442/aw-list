import React from "react";
import {Link} from "react-router-dom";
import {Meteor} from "meteor/meteor";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ""
    };
  }

  onSubmit(e) {
    e.preventDefault();

    // Beides wird gekürzt
    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();

    Meteor.loginWithPassword({email}, password, (err) => {
      if (err) {
        this.setState({error: "Login nicht möglich. Überprüfe Email und Passwort"});
      } else {
        this.setState({error: ""});
      }
    });
  }

  render() {
    return(
      <div>
        <h1>Team Manager</h1>
        <img border="0" height="51" hspace="0" src="/images/logo.png" width="263" />
        {this.state.error ? <p>{this.state.error}</p> : undefined}

        <form onSubmit={this.onSubmit.bind(this)} noValidate>
          <input type="email" ref="email" name="email" placeholder="Email"/>
          <input type="password" ref="password" name="password" placeholder="Passwort"/>
          <button className="buttonColor">Einloggen</button>
        </form>
        <Link to="/signup" replace className="linkColor">Account erstellen</Link>
      </div>
    );
  }
};

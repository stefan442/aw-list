import React from "react";
import {Link} from "react-router-dom";
import {Accounts} from "meteor/accounts-base";

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ""
    };
  }

  onSubmit(e) {
    e.preventDefault();

    // Email und Passwort werden gekürzt
    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();

    if (password.length < 6) {
      return this.setState({error: "Passwort muss länger als 5 Zeichen sein"});
    }

    // Erstellt User und prüft Email in users.api
    Accounts.createUser({email, password}, (err) => {
      if (err) {
        this.setState({error: err.reason});
      } else {
        this.setState({error: ""});
      }
    });
  }

  render() {
    return (
      <div>
        <h1>Erstelle einen Account</h1>
        <img border="0" height="51" hspace="0" src="/images/logo.png" width="263" />
        {this.state.error ? <p>{this.state.error}</p> : undefined}

        <form onSubmit={this.onSubmit.bind(this)} noValidate>
          <input type="email" ref="email" name="email" placeholder="Email"/>
          <input type="password" ref="password" name="password" placeholder="Passwort"/>
          <button className="buttonColor">Account erstellen</button>
        </form>
        <Link to="/" replace className="linkColor">Du hast bereits einen Account?</Link>
      </div>
    );
  }
};

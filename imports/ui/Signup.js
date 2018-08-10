import React from "react";
import {Link} from "react-router-dom";
import {Accounts} from "meteor/accounts-base";
import TextField from '@material-ui/core/TextField';

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
    let email = e.target.email.value.trim();
    let username = e.target.username.value;
    let password = e.target.password.value.trim();

    if (password.length < 6) {
      return this.setState({error: "Passwort muss mindesten 6 Zeichen lang sein"});
    }

    // Erstellt User und prüft Email in users.api
    Accounts.createUser({email, username, password}, (err) => {
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
        <div className="Header">
          <div>
            {/* <button onClick={this.onBack.bind(this)} className="buttonColor">Back</button> */}
          </div>
          <div className="headerText">
            Teammanager
          </div>
          <div className="logoutButton">
            {/* <button onClick={this.onLogout.bind(this)} className="buttonColor">Logout</button> */}
          </div>
        </div>
        <div>
          <div className="LogoSgm">
            <img border="0" height="102" hspace="0" src="/images/sgm_logo.png" width="94" />
          </div>
          <div>
            {this.state.error ? <p>{this.state.error}</p> : undefined}
            <form onSubmit={this.onSubmit.bind(this)} noValidate className="loginForm">
              <h1 className="smallHeaderText">Erstelle einen Account</h1>
              <TextField type="email" name="email" placeholder="Email" className="loginField"/>
              <TextField type="username" name="username" placeholder="Name" className="loginField"/>
              <TextField type="password" name="password" placeholder="Passwort" className="loginField"/>
              <button type="submit" className="buttonColor">Account erstellen</button>
              <Link to="/" replace className="linkColor loginLink">Du hast bereits einen Account?</Link>
            </form>
          </div>
          <div className="LogoClientis">
            <img border="0" height="51" hspace="0" src="/images/logo.png" width="263" />
            <p>Developed by Team Clientis</p>
          </div>
        </div>
      </div>
    );
  }
};

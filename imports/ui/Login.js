import React from "react";
import {Link} from "react-router-dom";
import {Meteor} from "meteor/meteor";
import TextField from '@material-ui/core/TextField';

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
    let email = e.target.email.value.trim();
    let password = e.target.password.value.trim();

    Meteor.loginWithPassword({email}, password, (err) => {
      if(err) {
        this.setState({error: "Login nicht möglich. Überprüfe Email und Passwort"});
      }
      else {
        this.setState({error: ""});
      }
    });
  }

  render() {
    return(
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
              <TextField type="email" name="email" placeholder="Email" className="loginField"/>
              <TextField type="password" name="password" placeholder="Passwort" className="loginField"/>
              <button type="submit" className="buttonColor">Einloggen</button>
              <Link to="/signup" replace className="linkColor loginLink">Account erstellen</Link>
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

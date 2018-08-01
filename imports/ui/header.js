import {Meteor} from "meteor/meteor";
import {Route, Router, Switch} from "react-router-dom";
import React from "react";
import createHistory from "history/createBrowserHistory";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ""
    };
  }

  onLogout() {
    Accounts.logout();
  }

  onBack(){
    this.props.history.goBack();
  }

  render() {
    return(
      <div className="Header">
        <div>
          {/* <button onClick={this.onBack.bind(this)} className="buttonColor">Back</button> */}
        </div>
        <div className="headerText">
          Teammanager
        </div>
        <div>
          {/* <button onClick={this.onLogout.bind(this)} className="buttonColor logoutButton">Logout</button> */}
        </div>
      </div>
    );
  }
};

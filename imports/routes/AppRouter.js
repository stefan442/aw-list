import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { Router, Route, Switch } from "react-router-dom";
import React from "react";
import createHistory from "history/createBrowserHistory";

import Signup from "../ui/Signup";
import NotFound from "../ui/NotFound";
import Login from "../ui/Login";
import DateList from "../ui/DateList";

//tabellen fuer anwesenheitsliste
import { Dates } from './../api/dates.js';
import { Players } from './../api/players.js';
import { Atendence } from './../api/atendence.js';

const unauthenticatedPages = ["/", "/signup"];
const authenticatedPages = ["/dates"];

export const onAuthChange = (isAuthenticated) => {
  const pathname = history.location.pathname;
  const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
  const isAuthenticatedPage = authenticatedPages.includes(pathname);

  if (isAuthenticated) {
    if (isUnauthenticatedPage) {
      history.replace("/dates");
    }
  } else {
    if (isAuthenticatedPage) {
      history.replace("/");
    }
  }
};

export const history = createHistory();

export class AppRouter extends React.Component {
//constructer fuer state-daten der anwesenheitsliste
  constructor(props){
      super(props);
      this.state = {
        date: [],
        players: [],
        atendence: [],
      }
  }


  onEnterPublicPage() {
    if (Meteor.userId()) {
      this.props.history.replace("/dates");
    }
  }
  onEnterPrivatePage() {
    if (!Meteor.userId()) {
      this.props.history.replace("/");
    }
  }
  //
  // renderAtendenceList = (props) => {
  //   let dates = this.state.dates;
  //   let players = this.state.players;
  //
  //   return(<App dates={dates} players={players} {...props}/>)
  // };
  //
  // renderAtend = (props) => {
  //   Meteor.call('createAtendence', props);
  //   return(<Atend {...props}/>);
  // };




  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" component={Login} exact={true} onEnter={this.onEnterPublicPage}/>
          <Route path="/signup" component={Signup} onEnter={this.onEnterPublicPage}/>
          <Route exact path="/dates" component={DateList}/>

          <Route path="*" component={NotFound}/>
        </Switch>
      </Router>
    );
  }
};

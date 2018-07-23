import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { Router, Route, Switch } from "react-router-dom";
import React from "react";
import createHistory from "history/createBrowserHistory";

import Signup from "../ui/Signup";
import NotFound from "../ui/NotFound";
import Login from "../ui/Login";
import DateList from "../ui/DateList";
import AtendList from "../ui/AtendList";
import PlayersList from "../ui/PlayersList";
import PlayerProfil from "../ui/PlayerProfil";

//tabellen fuer anwesenheitsliste
import { Dates } from './../api/dates.js';
import { Players } from './../api/players.js';
import { Atendence } from './../api/atendence.js';

const unauthenticatedPages = ["/", "/signup"];
const authenticatedPages = ["/datelist"];

export const onAuthChange = (isAuthenticated) => {
  const pathname = history.location.pathname;
  const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
  const isAuthenticatedPage = authenticatedPages.includes(pathname);

  if (isAuthenticated) {
    if (isUnauthenticatedPage) {
      history.replace("/datelist");
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
      this.props.history.replace("/datelist");
    }
  }
  onEnterPrivatePage() {
    if (!Meteor.userId()) {
      this.props.history.replace("/");
    }
  }




  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" component={Login} exact={true} onEnter={this.onEnterPublicPage}/>
          <Route path="/signup" component={Signup} onEnter={this.onEnterPublicPage}/>
          <Route exact path="/datelist" component={DateList}/>
          <Route exact path="/atendlist/:_id" component={AtendList}/>
          <Route exact path="/playerslist" component={PlayersList}/>
          <Route exact path="/playerprofil/:_id" component={PlayerProfil}/>
          <Route path="*" component={NotFound}/>
        </Switch>
      </Router>
    );
  }
};

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

import TeamPage from "../ui/TeamPage";


//tabellen fuer anwesenheitsliste
import { Dates } from './../api/dates.js';
import { Players } from './../api/players.js';
import { Atendence } from './../api/atendence.js';
// alle seiten nach login
const unauthenticatedPages = ["/", "/signup"];
const authenticatedPages = ["/teampage", "/datelist/:_id", "/atendlist/:_id", "/playerslist/:_id", "/playerprofil/:_id"];


export const onAuthChange = (isAuthenticated) => {
  const pathname = history.location.pathname;
  const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
  const isAuthenticatedPage = authenticatedPages.includes(pathname);

  if (isAuthenticated) {
    if (isUnauthenticatedPage) {
      history.replace("/teampage");
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
      this.props.history.replace("/teampage");
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
          <Route path="/teampage" component={TeamPage} onEnter={this.onEnterPrivatePage}/>
          <Route path="/datelist/:_id" component={DateList} onEnter={this.onEnterPrivatePage}/>
          <Route path="/atendlist/:_id" component={AtendList} onEnter={this.onEnterPrivatePage}/>
          <Route path="/playerslist/:_id" component={PlayersList} onEnter={this.onEnterPrivatePage}/>
          <Route path="/playerprofil/:_id" component={PlayerProfil} onEnter={this.onEnterPrivatePage}/>

          <Route path="*" component={NotFound}/>
        </Switch>
      </Router>
    );
  }
};

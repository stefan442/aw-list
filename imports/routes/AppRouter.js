import {Meteor} from "meteor/meteor";
import {Route, Router, Switch} from "react-router-dom";
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
          /*Public*/
          <Route path="/" component={Login} exact={true} onEnter={this.onEnterPublicPage}/>
          <Route path="/signup" component={Signup} onEnter={this.onEnterPublicPage}/>
          /*Private*/
          <Route path="/teampage" component={TeamPage} onEnter={this.onEnterPrivatePage}/>
          <Route path="/datelist/:_id" component={DateList} onEnter={this.onEnterPrivatePage}/>
          <Route path="/atendlist/:_id" component={AtendList} onEnter={this.onEnterPrivatePage}/>
          <Route path="/playerslist/:_id" component={PlayersList} onEnter={this.onEnterPrivatePage}/>
          <Route path="/playerprofil/:_id" component={PlayerProfil} onEnter={this.onEnterPrivatePage}/>
          /*Not Found*/
          <Route path="*" component={NotFound}/>
        </Switch>
      </Router>
    );
  }
}

import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { Router, Route, Switch } from "react-router-dom";
import React from "react";
import createHistory from "history/createBrowserHistory";

import Signup from "../ui/Signup";
import NotFound from "../ui/NotFound";
import Login from "../ui/Login";
import TeamPage from '../ui/Teampage.js';

const unauthenticatedPages = ["/", "/signup"];
const authenticatedPages = ["/teampage"];

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
          <Route path="/teampage" component={TeamPage}/>
          <Route path="*" component={NotFound}/>
        </Switch>
      </Router>
    );
  }
};

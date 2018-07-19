import './main.html';
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import React from "react";
import ReactDOM from "react-dom";
import SimpleSchema from "simpl-schema";

import { AppRouter, history, onAuthChange } from "../imports/routes/AppRouter.js";
import "../imports/startup/simple-schema-configuration.js";

Tracker.autorun(() => {
  const isAuthenticated = !!Meteor.userId();
  onAuthChange(isAuthenticated);
});

Meteor.startup(() => {
  ReactDOM.render(<AppRouter/>, document.getElementById("app"));
})

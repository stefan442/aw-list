import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Switch, Redirect} from 'react-router-dom';
import createHistory from "history/createBrowserHistory";

import {Teams} from '../api/teams.js';
import {history, AppRouter} from '../routes/AppRouter.js';

export default class Team extends React.Component {

      render(){
        return(
          <div>
            <h3>{this.props.team.name}</h3>
          <div>
            <button onClick={() => {
              this.props.history.push('/dummy/' + this.props.team._id)
            }}>{this.props.team.name}</button>
            <button onClick={() => Meteor.call('teamRemove', this.props.team._id)}>
              Mannschaft löschen
            </button>
          </div>
          </div>
        );
      }
};

Team.propTypes = {
  team: PropTypes.object.isRequired
};

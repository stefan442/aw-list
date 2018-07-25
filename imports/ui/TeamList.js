import React from 'react';
import PropTypes from 'prop-types';
import {Tracker} from 'meteor/tracker';

import TeamFunc from './TeamFunc.js';
import {Teams} from '../api/teams.js';

export default class TeamList extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        team: []
      };
    }
    componentWillMount(){
      this.teamTracker = Tracker.autorun(() =>{
        Meteor.subscribe("teams");
        const teams = Teams.find({}, {sort: {name: 1}}).fetch();
        this.setState({ teams });
      });
    }
    componentWillUnmount(){
      this.teamTracker.stop();
    }
    renderTeams(){
      if (this.state.teams.length === 0){
      return(
        <div>
          <p>Bitte eine Mannschaft hinzufügen!</p>
        </div>
      )
    } else {
      return this.state.teams.map((team) => {
        return <TeamFunc key={team._id} team={team} {...this.props}/>;
      });
    }
  }
  render(){
    return(
      <div>
        {this.renderTeams()}
      </div>
    );
  }
};

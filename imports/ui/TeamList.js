import {Meteor} from 'meteor/meteor';
import React from 'react';
import {Tracker} from 'meteor/tracker';
import {TrainerTeam} from './../api/trainerTeam.js';

import TeamFunc from './TeamFunc.js';
import {Teams} from '../api/teams.js';

export default class TeamList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      teams: [],
      users: [],
    };
  }
  componentWillMount(){
    this.teamTracker = Tracker.autorun(() => {
      Meteor.subscribe("trainerTeam");
      Meteor.subscribe("teams");
      let id = TrainerTeam.find({trainer: Meteor.userId()}).fetch();
        id = id.map((teamId) => {
          return teamId.team;
        });
      const teams = Teams.find({_id: {$in: id}}, {sort: {name: 1}}).fetch();
      this.setState({ teams });
    });
  }
  componentWillUnmount(){
    this.teamTracker.stop();
  }
  renderTeams(){
    if(this.state.teams.length === 0){
      return(
        <div>
          <p className="teamListCentered">Bitte eine Mannschaft hinzufügen!</p>
        </div>
      )
    }
    else{
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

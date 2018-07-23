import React from 'react';
import PropTypes from 'prop-types';
import {Tracker} from 'meteor/tracker';

import Teamfunc from './Teamfunc.js';
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
        this.setState({
          teams: Teams.find({}, {sort: {name: 1}}).fetch()
        });
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
        return <Teamfunc key={team._id} team={team} {...this.props}/>;
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

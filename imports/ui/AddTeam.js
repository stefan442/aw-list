import React from 'react';
import {Teams} from '../api/teams.js';

export default class AddTeam extends React.Component {
  handleSubmit(e){
    let teamName = e.target.teamName.value;

    e.preventDefault();

    if(teamName){
      e.target.teamName.value = '';
      Teams.insert({
        name: teamName
      });
    }
  }
  render(){
    return(
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          	<input type="text" name="teamName" placeholder="Mannschaftsname" />
            <button>Team hinzufügen</button>
        </form>
      </div>
    );
  }
};
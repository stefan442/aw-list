import React from 'react';

import AddTeam from './AddTeam.js';
import TeamList from './TeamList.js';
import Header from './header.js';


export default class TeamPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      title: "Meine Teams"
    };
  }

  onLogout(){
    Accounts.logout();
  }
  onBack(){
    Accounts.logout();
  }

  render(){
    return(
      <div>
        <div className="sticky">
          <Header/>
        </div>
        <div>
          <h1 className="teamListCentered">{this.state.title}</h1>
          <TeamList {...this.props}/>
          <div className="AddTeamSticky">
            <AddTeam />
          </div>
        </div>
      </div>
    );
  }
};

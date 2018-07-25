import React from 'react';

import AddTeam from './AddTeam.js';
import TeamList from './TeamList.js';


export default class TeamPage extends React.Component {
      constructor(props){
        super(props);
        this.state = {
            title: "Mannschaften"
        };
      }
      render(){
        return(
          <div>
            <TeamList {...this.props}/>
            <AddTeam/>
          </div>
        );
      }
};

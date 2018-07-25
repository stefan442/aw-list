import React from "react";

import { Players } from './../api/players.js';

export default class MissingPlayers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      atendingPlayers: this.props.atendingPlayers,
      players: [],
      date: this.props.date,
    }
  }

  componentDidMount(){
    this.playersTracker = Tracker.autorun(() => {
        Meteor.subscribe("players");
        const players = Players.find().fetch();
        this.setState({ players });
      }
    );
  }

  updateAtendence(playerId){
    let newAtend ={
      player: playerId,
      date: this.state.date._id,
      teamId: this.state.date.teamId,
    };
    Meteor.call('updateAtendence', newAtend);
  }

    componentWillUnmount(){
      this.playersTracker.stop();
    }



  render(){
    let players = Players.find().fetch();
    players = players.filter((player) => {

      let noAtend = this.state.atendingPlayers.find((obj) => {
        if(obj._id == player._id){
          return obj;
        }
      });
      if(noAtend == undefined){
        return player;
      }
    })

    if(players != undefined && players.length != 0){
      var missingPlayer = players.map((player) => {
          return (<div key={player._id} >
          <button onClick={() =>{this.updateAtendence(player._id)}}> {player.name} </button>
          </div>)
        })
    }
    return(
      <div>{missingPlayer}</div>

    );
  }


}

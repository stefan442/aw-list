import React from "react";

import {Players} from './../api/players.js';

export default class MissingPlayers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      atendingPlayers: this.props.atendingPlayers,
      players: [],
      date: this.props.date,
    }
  }
  //Tracker zum laden der Spieler
  componentDidMount(){
    this.playersTracker = Tracker.autorun(() => {
        Meteor.subscribe("players");
        const players = Players.find({teamId: this.props.date.teamId}).fetch();
        this.setState({ players });
    });
  }

  //stoppt den Tracker
  componentWillUnmount(){
    this.playersTracker.stop();
  }
//funktion zum methodanufruf um Atendencesaetze zum updaten
  updateAtendence(playerId){
    let newAtend ={
      player: playerId,
      date: this.state.date._id,
      teamId: this.state.date.teamId,
    };
    Meteor.call('updateAtendence', newAtend);
  }

  render(){
    let players = this.state.players;
    players = players.filter((player) => {
      let noAtend = this.state.atendingPlayers.find((obj) => {
        if(obj._id === player._id){
          return obj;
        }
      });
      if(noAtend === undefined){
        return player;
      }
    });
    if(players !== undefined && players.length !== 0){
      this.missingPlayers = players.map((player) => {
        return (
          <div key={player._id}>
            <button type="button" onClick={(e) =>{
              e.target.style.visibility='hidden';
              this.updateAtendence(player._id)}} className="buttonColor"> {player.name}
            </button>
          </div>
        )
      })
    }
    return(
      <div>{this.missingPlayers}</div>
    );
  }
}

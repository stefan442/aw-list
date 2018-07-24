import React from "react";
import {render} from "react-dom";
import './../../client/main.html';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import history from './../routes/AppRouter.js';
import createHistory from "history/createBrowserHistory";
import {Mongo} from 'meteor/mongo';
// import "react-table/react-table.css";
import ReactTable from "react-table";

import './../../client/main.html';
import PlayersList from './PlayersList.js';

import {Dates} from '../api/dates.js';
import { Players } from './../api/players.js';
import { Atendence } from './../api/atendence.js';


export default class PlayerProfil extends React.Component{
  constructor(props) {
    super(props);

    let player = Players.findOne({_id: this.props.match.params._id});


    this.state = {
      player: player,
      atendence: [],
      dates: [],
    }
  }
  componentDidMount(){
  this.playersTracker = Tracker.autorun(() => {
    // debugger;
      Meteor.subscribe("atendence");
      debugger;
      // let dateId = dates.map((date) =>{return date._id});
      const atendence = Atendence.find({player: this.state.player._id}).fetch();
      this.setState({ atendence });

      Meteor.subscribe("dates");
      let dateId = atendence.map((atend) =>{return atend.date});

      const dates = Dates.find({_id: {$in: dateId}}).fetch();
      this.setState({ dates });
     // debugger;

      }
    );
  }

  componentWillUnmount(){
    this.playersTracker.stop();
  }

  goToPlayersList() {

    this.props.history.push('/playerslist/' + this.state.player.teamId);
  }

  playerDelete(e) {
    Meteor.call('playerDelete', e);

    this.props.history.push('/playerslist/' + this.state.player.teamId);

  }

  // calculatAtendence(){
  //   let percentage =
  //
  // }


  render(){
    let player = this.state.player;
    let dates = this.state.dates;
    dates = dates.map((date) => {
      let atendDB = this.state.atendence.find((obj) => {
        if(obj.date == date._id){
          return obj;
        }
      });

      let atend = atendDB.atend;

      return {
        ...date,
        atend: atend + "",
      }
    });
    return(
      <div>
      <h1>Spieler Profil</h1>
      <button onClick={this.goToPlayersList.bind(this)}>&#x2299;</button>
      <button onClick={() => {this.playerDelete(player)}}>-</button>,
      <p>Name: {player.name}</p>
      <p>Tel.Nr.: {player.phoneNumber}</p>

      <p>Anwesenheit:</p>

      <ReactTable
        data = {dates}
          columns={[
            {
              Header: "Datum",
              accessor: "date",
            },
            {
              Header: "Art",
              accessor: "art",
            },
            {
              Header: "Anwesend",
              accessor: "atend",
            },

            ]}
            defaultPageSize={10}
            className="-striped -highlight"
          />

      </div>

    )
  }
}

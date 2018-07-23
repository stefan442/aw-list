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
      Meteor.subscribe("dates");
      const dates = Dates.find().fetch();
      this.setState({ dates });
     // debugger;
      Meteor.subscribe("atendence");
      let dateId = dates.map((date) =>{return date._id});
      const atendence = Atendence.find({date: {$in: dateId}, player: this.state.player._id}).fetch();
      this.setState({ atendence });
      }
    );
  }

  componentWillUnmount(){
    this.playersTracker.stop();
  }

  goToPlayersList() {
    this.props.history.push('/playerslist');
  }

  playerDelete(e) {
    Meteor.call('playerDelete', e);
    this.props.history.push('/playerslist');

  }

  // calculatAtendence(){
  //   let percentage =
  //
  // }


  render(){
    let player = this.state.player;
    let dates = this.state.dates;
    dates = dates.map((date) => {
      // debugger;
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
      <p>Anwesenheit: {() => {this.calculatAtendence.bind(this)}</p>

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

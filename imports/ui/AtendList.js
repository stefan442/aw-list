import React from "react";
import {render} from "react-dom";
import './../../client/main.html';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import {Mongo} from 'meteor/mongo';
// import "react-table/react-table.css";
import ReactTable from "react-table";
import history from './../routes/AppRouter.js';
// import createHistory from "history/createBrowserHistory";

import './../../client/main.html';
import DateList from './DateList.js';

import { Dates } from './../api/dates.js';
import { Players } from './../api/players.js';
import { Atendence } from './../api/atendence.js';

export default class AtendList extends React.Component {
  constructor(props) {
    super(props);
    let date = Dates.findOne({_id: this.props.match.params._id});

    this.state = {
      players: [],
      atendence: [],
      date: date,
    }
  }

  componentDidMount(){
    this.playersTracker = Tracker.autorun(() => {
        Meteor.subscribe("players");
        const players = Players.find().fetch();
        this.setState({ players });

        Meteor.subscribe("atendence");
        let playerIds = players.map((player) =>{return player._id});
        const atendence = Atendence.find({date: this.props.match.params._id, player: {$in: playerIds}}).fetch();
        this.setState({ atendence });
      }
    );
  }

  componentWillUnmount(){
    this.playersTracker.stop();
  }

//route zur DateList
  goToApp() {
    this.props.history.replace('/datelist/' + this.state.date.teamId);
  }

  addAtend(e){
      Meteor.call ('toggleAtendence', {playerRow: e, today: this.props.match.params._id});
  }
  dateDelete(e) {
    Meteor.call('dateDelete', e);
    this.props.history.replace('/datelist/' + this.state.date.teamId);

  }

  render(){
    let date  = this.state.date;
    let players = this.state.players;
    players = players.map((player) => {
    let atendDB = this.state.atendence.find((obj) => {
      if(obj.player == player._id){
        return obj;
      }
    });
    let atend = false;
    if(atendDB){
      atend = atendDB.atend;
    }
    return {
      ...player,
      buttontext: atend + "",
    }
    })

    return (
      <div>
        <p>Spielerliste</p>
        <button onClick={this.goToApp.bind(this)}>&#x2299;</button>
        <button onClick={() => this.dateDelete(date).bind(this)}>-</button>,
        <p> {date.date}</p>
        <p> Info: {date.info} </p>
        <ReactTable
          data = {players}
           columns={[
            {
              Header: "Name",
              accessor: "name",
            },
            {
              Header: "Anwesenheit",
              accessor: "countAtend",
            },
            {
              Header: "Termine Gesamt",
              accessor: "countdays",
            },
            {
              Header: "Anwesned",
              width: 65,

              Cell: (row) =>  <button  onClick={() => {this.addAtend(row.original);}}>{row.original.buttontext}</button>
            },

          ]
        }
      />

      </div>

    );
  }
}
AtendList.propTypes = {
  history: PropTypes.object
}

AtendList.defaultProps = {
  history: history
};

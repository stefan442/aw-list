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
import Modal from 'react-modal';

import './../../client/main.html';
import DateList from './DateList.js';
import MissingPlayers from './MissingPlayers.js';

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
    this.handleOpenModalPlayer = this.handleOpenModalPlayer.bind(this);
    this.handleCloseModalPlayer = this.handleCloseModalPlayer.bind(this);
  }

  componentDidMount(){
    this.playersTracker = Tracker.autorun(() => {

        Meteor.subscribe("atendence");
        const atendence = Atendence.find({date: this.props.match.params._id, teamId: this.state.date.teamId}).fetch();
        this.setState({ atendence });
        Meteor.subscribe("players");
        let playerIds = atendence.map((atend) =>{return atend.player});
        const players = Players.find({_id: {$in: playerIds}}).fetch();
        this.setState({ players });

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
  handleOpenModalPlayer () {
    this.setState({ showModalPlayer: true });
  }

  handleCloseModalPlayer () {
     this.setState({ showModalPlayer: false });
  }

  onSubmitPlayer = (e) => {
    e.preventDefault();
    let player = {
                  name: e.target.name.value,
                  phoneNumber: e.target.phone.value,
                  teamId: this.state.date.teamId,
                  today: this.state.date.date,
                };
    Meteor.call('onSubmitPlayer', player);
    e.target.name.value = "";
    this.handleCloseModalPlayer();

  }



  render(){
    let date  = this.state.date;
    let formatedDate = moment(date.date).format("DD.MM.YYYY");
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


    // .bind(this) entfernen wenn vorhanden bei dateDelete
    return (
      <div>
        <p>Spielerliste</p>
        <button onClick={this.goToApp.bind(this)}>&#x2299;</button>
        <button onClick={() => this.dateDelete(date)}>-</button>
        <button onClick={this.handleOpenModalPlayer}>Spieler hinzufügen</button>

        <p> {formatedDate}</p>
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
      <Modal
         isOpen={this.state.showModalPlayer}
         contentLabel="onRequestClose Example"
         onRequestClose={this.handleCloseModalPlayer}
         shouldCloseOnOverlayClick={false}
      >
        <p> Spieler hinzufuegen</p>


        <div> <MissingPlayers {...this.props} atendingPlayers={players} date={date}/> </div>


        <form onSubmit={this.onSubmitPlayer.bind(this)}>
          <input type="text" name="name" placeholder="name"  />
          <input type="text" name="phone" placeholder="phone"  />
          <button type="submit">OK!</button>
        </form>
        <button  onClick={this.handleCloseModalPlayer}>Abbrechen</button>,

      </Modal>
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

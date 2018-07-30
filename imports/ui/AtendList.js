import React from "react";
import './../../client/main.html';
import PropTypes from 'prop-types';
import "react-table/react-table.css";
import ReactTable from "react-table";
import history from './../routes/AppRouter.js';
// import createHistory from "history/createBrowserHistory";
import Modal from 'react-modal';

import {Dates} from './../api/dates.js';
import {Players} from './../api/players.js';
import {Atendence} from './../api/atendence.js';
import MissingPlayers from './MissingPlayers.js';

export default class AtendList extends React.Component {
  constructor(props) {
    super(props);
    let date = Dates.findOne({_id: this.props.match.params._id});

    this.state = {
      players: [],
      atendence: [],
      date: date,
    };

    this.handleOpenModalPlayer = this.handleOpenModalPlayer.bind(this);
    this.handleCloseModalPlayer = this.handleCloseModalPlayer.bind(this);
  }
//Tracker zum laden der Atendence Saetze und Spieler
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
  componentWillMount() {
    Modal.setAppElement('body');
 }

//stoppt den Tracker
  componentWillUnmount(){
    this.playersTracker.stop();
  }

//route zur DateList
  goToApp() {
    this.props.history.replace('/datelist/' + this.state.date.teamId);
  }
//ruft die methode zum setzen der Anwesenheit auf
  addAtend(e){
    let thisToday = moment().format('YYYY-MM-DD');
    let actualDay = this.state.date;

    if(actualDay.date <= thisToday){
      Meteor.call ('toggleAtendence', {playerRow: e, today: this.props.match.params._id});
    }
  }
  //ruft die Methode zum loeschen eines Termins auf
  //navigiert zum Temin-Liste zurueck
  dateDelete(e) {
    Meteor.call('dateDelete', e);
    this.props.history.replace('/datelist/' + this.state.date.teamId);

  }
  //funktion zum oeffnen des popups um einen spieler hinzuzufuegen
  handleOpenModalPlayer () {
    this.setState({ showModalPlayer: true });
  }
  //funktion zum oeffnen des popups um einen spieler hinzuzufuegen

  handleCloseModalPlayer () {
     this.setState({ showModalPlayer: false });
  }

//Methodenaufruf zum hinzufuegen eines Spielers
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

  };



  render(){
    let date  = this.state.date;
    let formatedDate = moment(date.date).format("DD.MM.YYYY");
    let players = this.state.players;

    players = players.map((player) => {
      let atendDB = this.state.atendence.find((obj) => {
        if(obj.player === player._id){
          return obj;
        }
      });
      // let atend = false;
      let buttontext = "Nein";

      if(atendDB.atend){
        // atend = atendDB.atend;
        buttontext = "Ja";
      }
      return {
        ...player,
        buttontext: buttontext + "",
      }
    });



    return (
      <div>
        <p>Spielerliste</p>
        <button onClick={this.goToApp.bind(this)}>&#x2299;</button>
        <button onClick={() => this.dateDelete(date)}>-</button>
        <button onClick={this.handleOpenModalPlayer}>Spieler hinzufügen</button>

        <p> {formatedDate}</p>
        <p> Info: {date.art} </p>
        <p> Info: {date.info} </p>
        <ReactTable
          data = {players}
           columns={[
            {
              Header: "Name",
              accessor: "name",
            },

            {
              Header: "Anwesned",

              Cell: (row) =>  <button  onClick={() => {this.addAtend(row.original);}}>{row.original.buttontext}</button>
            },

          ]}
          defaultSorted={[
              {
                id: "name",
                desc: false
              }
          ]}
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
};

AtendList.defaultProps = {
  history: history
};

import React from "react";
import './../../client/main.html';
import PropTypes from 'prop-types';
import "react-table/react-table.css";
import ReactTable from "react-table";
import history from './../routes/AppRouter.js';
import Modal from 'react-modal';
import Header from './header.js';
import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';
import NativeSelect from '@material-ui/core/NativeSelect';

import {Dates} from './../api/dates.js';
import {Players} from './../api/players.js';
import {Atendence} from './../api/atendence.js';
import MissingPlayers from './MissingPlayers.js';

export default class AtendList extends React.Component{
  constructor(props){
    super(props);
    let date = Dates.findOne({_id: this.props.match.params._id});
    this.state = {
      players: [],
      atendence: [],
      date: date,
      showModalPlayer: false,
      showModalDelete: false,
      showModalChange: false,
    };
    this.handleOpenModalPlayer = this.handleOpenModalPlayer.bind(this);
    this.handleCloseModalPlayer = this.handleCloseModalPlayer.bind(this);
    this.handleOpenModalDelete = this.handleOpenModalDelete.bind(this);
    this.handleCloseModalDelete = this.handleCloseModalDelete.bind(this);
    this.handleOpenModalChange = this.handleOpenModalChange.bind(this);
    this.handleCloseModalChange = this.handleCloseModalChange.bind(this);
  }
//Tracker zum laden der Atendence Saetze und Spieler
  componentDidMount(){
    this.playersTracker = Tracker.autorun(() => {

        Meteor.subscribe("atendence");
        const atendence = Atendence.find({date: this.props.match.params._id, teamId: this.state.date.teamId}).fetch();
        this.setState({ atendence });

        Meteor.subscribe("players");
        let playerIds = atendence.map((atend) => {return atend.player});
        const players = Players.find({_id: {$in: playerIds}}).fetch();
        this.setState({ players });
      }
    );
  }

  componentWillMount(){
    Modal.setAppElement('body');
  }

//stoppt den Tracker
  componentWillUnmount(){
    this.playersTracker.stop();
  }

//route zur DateList
  goToApp(){
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
  dateDelete(){
    Meteor.call('dateDelete', this.state.date);
    this.props.history.replace('/datelist/' + this.state.date.teamId);
  }
  //funktion zum oeffnen des popups um einen spieler hinzuzufuegen
  handleOpenModalPlayer(){
    this.setState({ showModalPlayer: true });
  }
  //funktion zum oeffnen des popups um einen spieler hinzuzufuegen
  handleCloseModalPlayer(){
     this.setState({ showModalPlayer: false });
  }
  handleOpenModalDelete(){
    this.setState({ showModalDelete: true });
  }
  handleCloseModalDelete(){
     this.setState({ showModalDelete: false });
  }
  handleOpenModalChange(){
    this.setState({ showModalChange: true });
  }
  handleCloseModalChange(){
     this.setState({ showModalChange: false });
  }
//Methodenaufruf zum hinzufuegen eines Spielers
  onSubmitPlayer = (e) => {
    e.preventDefault();
    if(e.target.name.value){
      let player = {
        name: e.target.name.value,
        phoneNumber: e.target.phone.value,
        teamId: this.state.date.teamId,
        today: this.state.date.date,
      };
      Meteor.call('onSubmitPlayer', player);
    }
    e.target.name.value = "";
    this.handleCloseModalPlayer();
  };

  changeDate  = (e) => {
    e.preventDefault();
    let date = {
      id: this.state.date._id,
      art: e.target.art.value,
      info: e.target.info.value,
    };
    if((e.target.art.value != this.state.date.art) || (e.target.info.value != this.state.date.info)){
      Meteor.call('changedate', date);
      this.state.date.art = date.art;
      this.state.date.info = date.info;
    }
    this.handleCloseModalChange();
  }

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
      let buttontext = "Nein";
      if(atendDB.atend){
        buttontext = "Ja";
      }
      return{
        ...player,
        buttontext: buttontext + "",
      }
    });

    return(
      <div>
        <div className="sticky">
          <Header/>
        </div>
        <div>
          <div className="attendlistButtonRow">
            <button type="button" onClick={this.goToApp.bind(this)} className="buttonColor attendlistButtonRowSingle">Zurück</button>
            <button type="button" onClick={this.handleOpenModalDelete} className="buttonColor  attendlistButtonRowSingle">Termin löschen</button>
            <button type="button" onClick={this.handleOpenModalPlayer} className="buttonColor attendlistButtonRowSingle">Spieler hinzufügen</button>
          </div>
          <div className="playerprofilInfo">
            <div className="column">
              <div className="playerprofilInfo">
                <h3> {formatedDate}</h3>
                <p> Art: {date.art} </p>
              </div>
              <div className="playerprofilChange">
                <button type="button" onClick={this.handleOpenModalChange} className="buttonColor ">Bearbeiten</button>
              </div>
            </div>
            <div className="breakLine">
              <p> Info: {date.info} </p>
            </div>
          </div>
          <ReactTable
            data = {players}
            columns={[
              {
                Header: "Name",
                accessor: "name",
                sortable: false,
              },
              {
                Header: "Anwesend",
                sortable: false,
                Cell: (row) => <button onClick={() => {this.addAtend(row.original);}} className="buttonColor">{row.original.buttontext}</button>
              },
            ]}
            defaultSorted={[
              {
                id: "name",
                desc: false
              }
            ]}
            resizable={false}
            previousText='Zurück'
            nextText='Vor'
            pageText='Seite'
            ofText='von'
            showPageSizeOptions={false}
            defaultPageSize={11}
            className="-striped -highlight"
          />

          <Modal
            appElement = {document.getElementById('body')}
            isOpen={this.state.showModalPlayer}
            contentLabel="onRequestClose Example"
            onRequestClose={this.handleCloseModalPlayer}
            shouldCloseOnOverlayClick={false}
            className="boxed-view__box"
            overlayClassName="boxed-view boxed-view--modal"
          >
            <div className="">
              <p className="smallHeaderText">Spieler hinzufügen</p>
              <div className="missingPlayers">
                <MissingPlayers {...this.props} atendingPlayers={players} date={date}/>
              </div>
              <div>
                <form onSubmit={this.onSubmitPlayer.bind(this)}>
                  <div className="datelistModalText">
                    <TextField id="name" type="text" placeholder="Name"/>
                    <NumberFormat placeholder="Telefonnummer" customInput={TextField} id="phone" format="###############"/>
                  </div>
                  <div className="borderButton">
                    <button type="button" onClick={this.handleCloseModalPlayer} className="buttonColor">Abbrechen</button>
                    <button type="submit" className="buttonColor">OK</button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={this.state.showModalDelete}
            contentLabel="onRequestClose Example"
            onRequestClose={this.handleCloseModalDelete}
            shouldCloseOnOverlayClick={false}
            className="boxed-view__box confirmMessage"
            overlayClassName="boxed-view boxed-view--modal"
          >
            <p>Möchten Sie wirklich diesen Termin löschen?</p>
            <form className="borderButton">
              <button type="button" onClick={this.handleCloseModalDelete} className="buttonColor confirmButtons">Abbrechen</button>
              <button type="button" onClick={this.dateDelete.bind(this)} className="buttonColor confirmButtons">Löschen</button>
            </form>
          </Modal>

          <Modal
            isOpen={this.state.showModalChange}
            contentLabel="onRequestClose Example"
            onRequestClose={this.handleCloseModalChange}
            shouldCloseOnOverlayClick={false}
            className="boxed-view__box confirmMessage"
            overlayClassName="boxed-view boxed-view--modal"
          >
            <p>Termin ändern:</p>
            <div>
              <div>
                <form onSubmit={this.changeDate.bind(this)}>
                  <div className="datelistModalText">
                    <NativeSelect name="art" defaultValue={date.art} >
                      <option value={"Training"}>Training</option>
                      <option value={"Spiel"}>Spiel</option>
                      <option value={"Sonstiges"}>Sonstiges</option>
                    </NativeSelect>
                  </div>
                  <div className="datelistModalText">
                    <TextField
                      id="info"
                      multiline
                      rows="4"
                      type="text"
                      defaultValue={date.info}
                      placeholder="Info"
                      fullWidth
                    />
                  </div>
                  <div className="borderButton">
                    <button type="button" onClick={this.handleCloseModalChange} className="buttonColor">Abbrechen</button>
                    <button type="submit" className="buttonColor">Ok</button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>
        </div>
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

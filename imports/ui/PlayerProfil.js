import React from "react";
import ReactTable from "react-table";
import {Dates} from '../api/dates.js';
import {Players} from './../api/players.js';
import {Atendence} from './../api/atendence.js';
import Header from './header.js';
import Modal from 'react-modal';
import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';


export default class PlayerProfil extends React.Component{
  constructor(props){
    super(props);
    let player = Players.findOne({_id: this.props.match.params._id});
    let today = moment().format('YYYY-MM-DD');
    this.state = {
      player: player,
      atendence: [],
      dates: [],
      showModalDelete: false,
      showModalChange: false,
      today: today
    }
    this.handleOpenModalDelete = this.handleOpenModalDelete.bind(this);
    this.handleCloseModalDelete = this.handleCloseModalDelete.bind(this);
    this.handleOpenModalChange = this.handleOpenModalChange.bind(this);
    this.handleCloseModalChange = this.handleCloseModalChange.bind(this);
  }
  //Tracker zum laden der Atendence Saetze und Termine
  componentDidMount(){
    this.playersTracker = Tracker.autorun(() => {
      Meteor.subscribe("atendence");
      const atendence = Atendence.find({player: this.state.player._id}).fetch();
      this.setState({ atendence });

      Meteor.subscribe("dates");
      let dateId = atendence.map((atend) =>{return atend.date});
      const dates = Dates.find({_id: {$in: dateId}, date: {$lte: this.state.today}}).fetch();
      this.setState({ dates });
    });
  }
  componentWillMount(){
    Modal.setAppElement('body');
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
  //stoppt den Tracker
  componentWillUnmount(){
    this.playersTracker.stop();
  }
//navigation zur Spielerliste zurueck
  goToPlayersList(){
    this.props.history.replace('/playerslist/' + this.state.player.teamId);
  }
//funktion zum methoden aufruf um einen spieler zu loeschen und anscgliessend zur Spieler liste navigieren
  playerDelete(){
    Meteor.call('playerDelete', this.state.player);
    this.props.history.replace('/playerslist/' + this.state.player.teamId);
  }
  changePlayer = (e) => {
    e.preventDefault();
    let player = {
      id: this.state.player._id,
      name: e.target.name.value,
      phoneNumber: e.target.phone.value,
    };
    if((e.target.name.value != this.state.player.name) || (e.target.phone.value != this.state.player.phoneNumber)){
      Meteor.call('changePlayer', player);
      this.state.player.name = player.name;
      this.state.player.phoneNumber = player.phoneNumber;
    }
    this.handleCloseModalChange();
  }

  render(){
    let player = this.state.player;
    let dates = this.state.dates;
    dates = dates.map((date) => {
      date.formatedDate = moment(date.date).format("DD.MM.YYYY");
      let atendDB = this.state.atendence.find((obj) => {
        if(obj.date === date._id){
          return obj;
        }
      });
      // let atend = false;
      let buttontext = "Nein";
      if(atendDB.atend){
        // atend = atendDB.atend;
        buttontext = "Ja";
      }
      return{
        ...date,
        atend: buttontext + "",
      }
    });
    let percentage = Math.round(this.state.player.playerRelAt);
    return(
      <div>
        <div className="sticky">
          <Header/>
        </div>
        <div>
          <div className="playerprofilForm">
            <div className="borderButton">
              <button type="button" onClick={this.goToPlayersList.bind(this)} className="buttonColor playerprofilButtonBack">Zurück</button>
              <button type="button" onClick={this.handleOpenModalDelete} className="buttonColor playerprofilButtonDel">Spieler löschen</button>
            </div>
            <div className="column">
              <div className="playerprofilInfo">
                <p>Name: {player.name}</p>
                <p>Tel.Nr.: {player.phoneNumber}</p>
                <p>Anwesenheit: {percentage} % </p>
              </div>
              <div className="playerprofilChange">
                <button type="button" onClick={this.handleOpenModalChange} className="buttonColor ">Bearbeiten</button>
              </div>
            </div>
          </div>
          <div className="playerprofilTableFont">
            <ReactTable
              data = {dates}
              columns={[
                {
                  Header: "Datum",
                  accessor: "formatedDate",
                  sortable: false,
                },
                {
                  Header: "Art",
                  accessor: "art",
                },
                {
                  Header: "Anwesend",
                  accessor: "atend",
                  sortable: false,
                },
                {
                  accessor: "date",
                  show: false,
                },
              ]}
              defaultSorted={[
                {
                  id: "date",
                  desc: true,
                }
              ]}
              resizable={false}
              previousText='Zurück'
              nextText='Vor'
              pageText='Seite'
              ofText='von'
              showPageSizeOptions={false}
              defaultPageSize={12}
              className="-striped -highlight"
            />

            <Modal
              isOpen={this.state.showModalDelete}
              contentLabel="onRequestClose Example"
              onRequestClose={this.handleCloseModalDelete}
              shouldCloseOnOverlayClick={false}
              className="boxed-view__box confirmMessage"
              overlayClassName="boxed-view boxed-view--modal"
            >
              <p>Möchten Sie wirklich diesen Spieler löschen?</p>
              <form className="borderButton">
                <button type="button" onClick={this.handleCloseModalDelete} className="buttonColor confirmButtons">Abbrechen</button>
                <button type="button" onClick={this.playerDelete.bind(this)} className="buttonColor confirmButtons">Löschen</button>
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
              <p>Spieler ändern:</p>
              <div /*className="borderButton"*/>
                <div>
                  <form onSubmit={this.changePlayer.bind(this)}>
                    <div className="datelistModalText">
                      <TextField id="name" type="text" defaultValue={player.name} placeholder="Name" />
                      <NumberFormat placeholder="Telefonnummer" customInput={TextField} value={player.phoneNumber} id="phone" format="###############"/>
                    </div>
                    <div className="borderButton">
                      <button type="button" onClick={this.handleCloseModalChange} className="buttonColor">Abbrechen</button>
                      <button type="submit" className="buttonColor">OK</button>
                    </div>
                  </form>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    )
  }
}

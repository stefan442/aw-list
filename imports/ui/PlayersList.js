import React from "react";
import Modal from 'react-modal';
import ReactTable from "react-table";
import "react-table/react-table.css";
import {Players} from './../api/players.js';
import Header from './header.js';


export default class PlayersList extends React.Component{
  constructor(props) {
    super(props);
    let teamId = this.props.match.params._id;
    this.state = {
      players:[],
      teamId: teamId,
      showModalDate: false,
      showModalPlayer: false,
      value: 0,
    };

    this.handleOpenModalPlayer = this.handleOpenModalPlayer.bind(this);
    this.handleCloseModalPlayer = this.handleCloseModalPlayer.bind(this);
  }
  //Tracker zum laden der Spieler
  componentDidMount(){
    this.datesTracker = Tracker.autorun(() => {
        Meteor.subscribe("players");
        const players = Players.find({teamId: this.state.teamId}).fetch();
        this.setState({ players });
      }
    );
  }
  componentWillMount() {
    Modal.setAppElement('body');
  }

  //stoppt den Tracker
  componentWillUnmount(){
      this.datesTracker.stop();
  }
  //navigation zur Terminliste(tab)
  switchToDates(){
    this.props.history.replace('/datelist/' + this.state.teamId);
  }
//oeffnet popup zum Spielerhinzufuegen
  handleOpenModalPlayer () {
    this.setState({ showModalPlayer: true });
  }
  //schliesst popup zum Spielerhinzufuegen
  handleCloseModalPlayer () {
    this.setState({ showModalPlayer: false });
  }
//funktion zum Methodenaufruf um einen Spieler hinzufuegen
  onSubmitPlayer = (e) => {
    e.preventDefault();
    let today = moment().format("YYYY-MM-DD");
    let player = {
      name: e.target.name.value,
      phoneNumber: e.target.phone.value,
      today: today,
      teamId: this.state.teamId,
    };
    Meteor.call('onSubmitPlayer', player);
    e.target.name.value = "";
    this.handleCloseModalPlayer();
  };
//navigation zum spielerprofil
  goToPlayerProfil(e){
    let _id = e._id;
    this.props.history.replace('/playerprofil/' + _id);
  }
//navigation zur Teamliste (tab)
  switchToTeams(){
    this.props.history.replace('/teampage');
  }


  render() {
    let players = this.state.players;

    return(
      <div>
        <div>
          <Header/>
        </div>
        <div>
          <div className="navBardp">
            <button onClick={this.switchToTeams.bind(this)} className="buttonColor navigation">Team Liste</button>
            <button onClick={this.switchToDates.bind(this)} className="buttonColor navigation">Termin Liste</button>
            <button onClick={this.handleOpenModalPlayer} className="navigation buttonColor">Spieler hinzufügen</button>
        </div>
        <p> {players.name} </p>
        <ReactTable
          data = {players}
          columns={[
            {
              Header: "Name",
              sortable: false,
              Cell: (row) => <button onClick={() => {this.goToPlayerProfil(row.original);}} className="buttonColor">{row.original.name}</button>,
            },
            {
              Header: 'Anwesenheit',
              accessor: 'playerRelAt',
              Cell: (row) => (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#dadada',
                    borderRadius: '2px'
                  }}
                >
                  <div
                    style={{
                      width: `${row.original.playerRelAt}%`,
                      height: '100%',
                      backgroundColor: row.original.playerRelAt > 66 ? '#85cc00'
                      : row.original.playerRelAt > 33 ? '#ffbf00'
                      : '#ff2e00',
                      borderRadius: '2px',
                      transition: 'all .2s ease-out'
                    }}
                  />
                </div>
              )
            },
            {
              accessor: "name",
              show: false,
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
          defaultPageSize={14}
          className="-striped -highlight"
        />

        <Modal
          isOpen={this.state.showModalPlayer}
          contentLabel="onRequestClose Example"
          onRequestClose={this.handleCloseModalPlayer}
          shouldCloseOnOverlayClick={false}
          className="boxed-view__box"
          overlayClassName="boxed-view boxed-view--modal"
        >
          <p className="smallHeaderText">Spieler hinzufügen</p>
          <div className="borderButton">
            <form onSubmit={this.onSubmitPlayer.bind(this)}>
              <input type="text" name="name" placeholder="Name" className="inputField"/>
              <input type="text" name="phone" placeholder="Telefonnummer" className="inputField"/>
              <div>
                <button  onClick={this.handleCloseModalPlayer} className="buttonColor">Abbrechen</button>
                <button type="submit" className="buttonColor">OK</button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>

    );
  }
}

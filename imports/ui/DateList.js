import React from "react";
import Modal from 'react-modal';
import ReactTable from "react-table";
import "react-table/react-table.css";
import PropTypes from 'prop-types';
import moment from 'moment';
import NativeSelect from '@material-ui/core/NativeSelect';
import DateCalendar from './DateCalendar.js';
import {Dates} from '../api/dates.js';
import {Players} from './../api/players.js';
import TextField from '@material-ui/core/TextField';
import Header from './header.js';

export default class DateList extends React.Component{
  constructor(props){
    super(props);
    let teamId = this.props.match.params._id;
    let actualDay = moment().format("YYYY-MM-DD");
    this.state = {
      dates: [],
      allDates: [],
      players:[],
      teamId: teamId,
      showModalDate: false,
      showModalPlayer: false,
      value: 0,
      actualDay: actualDay,
      all: false,
    };
    this.handleOpenModalDate = this.handleOpenModalDate.bind(this);
    this.handleCloseModalDate = this.handleCloseModalDate.bind(this);
    this.handleOpenModalPlayer = this.handleOpenModalPlayer.bind(this);
    this.handleCloseModalPlayer = this.handleCloseModalPlayer.bind(this);
  }

  //Tracker zum laden der Termine und Spieler
  componentDidMount(){
    this.datesTracker = Tracker.autorun(() => {
        Meteor.subscribe("dates");
        const dates = Dates.find({date: {$lte: this.state.actualDay}, teamId: this.state.teamId}).fetch();
        this.setState({ dates });

        Meteor.subscribe("allDates");
        const allDates = Dates.find({teamId: this.state.teamId}).fetch();
        this.setState({ allDates });

        Meteor.subscribe("players");
        const players = Players.find({teamId: this.state.teamId}).fetch();
        this.setState({ players });
      }
    );
  }
  componentWillMount(){
    Modal.setAppElement('body');
  }

 //stoppt den Tracker
 componentWillUnmount(){
   this.datesTracker.stop();
 }

//oeffnet popup für Termin hinzufuegen
 handleOpenModalDate(){
   this.setState({ showModalDate: true });
 }
  //schliesst popup für Termin hinzufuegen
  handleCloseModalDate(){
    this.setState({ showModalDate: false });
  }
  //oeffnet popup für Spieler hinzufuegen
  handleOpenModalPlayer(){
    this.setState({ showModalPlayer: true });
  }
   //schliesst popup für Termin hinzufuegen
  handleCloseModalPlayer(){
    this.setState({ showModalPlayer: false });
  }

//route zur anwesenheitsliste
  goToAtend(e){
    let _id = e._id;
    this.props.history.replace('/atendlist/' + _id);
  }
//navigation zur spielerliste (tab)
  switchToPlayer(){
    this.props.history.replace('/playerslist/' + this.state.teamId);
  }
//navigation zurueck Temauswahl
  switchToTeams(){
    this.props.history.replace('/teampage');
  }
//funktion fuer den Methodenaufruf um einen Spieler hinzuzufuegen
  onSubmitDate = (e) => {
    e.preventDefault();
    let date = {
      date: e.target.date.value,
      art: e.target.art.value,
      info: e.target.info.value,
      teamId: this.state.teamId,
    };
    Meteor.call('onSubmitDate', date);
    e.target.date.value = "";
    e.target.art.value = "";
    e.target.info.value = "";
    this.handleCloseModalDate();
  };
  onLogout(){
    Accounts.logout()
  }

  onBack(){
    this.props.history.replace('/playerslist/' + this.state.teamId);
  }

  allDates(){
    this.setState({ all: true });
  }

  tillToday(){
    this.setState({ all: false });
  }

  render(){
    let dates = this.state.dates;
    if(!this.state.all){
      let dates = this.state.dates;
      dates = this.state.dates.map((date) => {
        date.formatedDate = moment(date.date).format("DD.MM.YYYY");
        return  date;
      });
    }
    else{
      dates = this.state.allDates;
      dates = this.state.allDates.map((date) => {
        date.formatedDate = moment(date.date).format("DD.MM.YYYY");
        return date;
      });
    }
    return(
      <div>
        <div className="sticky">
          <Header/>
        </div>
        <div>
          <div className="navBardp">
            <button type="button" onClick={this.switchToTeams.bind(this)} className="buttonColor navigation">Team Liste</button>
            <button type="button" onClick={this.switchToPlayer.bind(this)} className="buttonColor navigation">Spieler Liste</button>
            <button type="button" onClick={this.handleOpenModalDate} className="buttonColor navigation">Termin hinzufügen</button>
          </div>
          <div className="today">
            <button type="button" onClick={this.allDates.bind(this)} className="buttonColor todayButton">Alle Termine</button>
            <button type="button" onClick={this.tillToday.bind(this)} className="buttonColor todayButton">Termine bis Heute</button>
          </div>
          <ReactTable
            data = {dates}
            columns={[
              {
                Header: "Datum",
                Cell: (row) => <button onClick={() => {this.goToAtend(row.original);}} className="buttonColor">{row.original.formatedDate}</button>,
                sortable: false,
              },
              {
                Header: "Art",
                accessor: "art",
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
            defaultPageSize={13}
            className="-striped -highlight"
          />

          <Modal
            isOpen={this.state.showModalDate}
            contentLabel="onRequestClose Example"
            onRequestClose={this.handleCloseModalDate}
            shouldCloseOnOverlayClick={false}
            className="boxed-view__box"
            overlayClassName="boxed-view boxed-view--modal"
          >
            <p className="smallHeaderText">Termin hinzufügen</p>
            <div>
              <div>
                <form onSubmit={this.onSubmitDate.bind(this)}>
                  <div className="datelistModalText">
                    <DateCalendar/>
                  </div>
                  <div className="datelistModalText">
                    <NativeSelect name="art" >
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
                      placeholder="Info"
                      fullWidth
                    />
                  </div>
                  <div className="borderButton">
                    <button type="button" onClick={this.handleCloseModalDate} className="buttonColor">Abbrechen</button>
                    <button type="submit" className="buttonColor">Hinzufügen</button>
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
DateList.propTypes = {
  history: PropTypes.object
};
DateList.defaultProps = {
  history: history
};

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
  constructor(props) {
    super(props);
    let teamId = this.props.match.params._id;
    let today= moment().format("DD.MM.YYYY");

    this.state = {
      dates: [],
      players:[],
      teamId: teamId,
      showModalDate: false,
      showModalPlayer: false,
      value: 0,
      today: today,
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
        const dates = Dates.find({teamId: this.state.teamId}).fetch();
        this.setState({ dates });

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

//oeffnet popup für Termin hinzufuegen
 handleOpenModalDate () {
   this.setState({ showModalDate: true });
  }
  //schliesst popup für Termin hinzufuegen
  handleCloseModalDate () {
    this.setState({ showModalDate: false });
  }
  //oeffnet popup für Spieler hinzufuegen
  handleOpenModalPlayer () {
    this.setState({ showModalPlayer: true });
   }
   //schliesst popup für Termin hinzufuegen
   handleCloseModalPlayer () {
     this.setState({ showModalPlayer: false });
   }

//route zur anwesenheitsliste
   goToAtend(e) {
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
//navigiert zum Temin am heutigen Tag
  goTodayAtend(){
    let today = moment().format("YYYY-MM-DD");
    let date = this.state.dates.find((obj) => {
        if(obj.date === today){
          return obj;
        }
      }
    );
    if(date){
      this.props.history.replace('/atendlist/' + date._id);
    }
    else{
      return alert("Heute kein Termin");
    }
  }

  onLogout(){
    Accounts.logout()
  }

  onBack(){
    this.props.history.replace('/playerslist/' + this.state.teamId);
  }

  render() {
    let dates = this.state.dates.map((date) =>{
        date.formatedDate = moment(date.date).format("DD.MM.YYYY");
        return  date;
    });
    let today = this.state.today;


    return(
      <div>
        <Header/>
      <div>
        <div className="navBardp">
          <button onClick={this.switchToTeams.bind(this)} className="buttonColor navigation">Team Liste</button>
          <button onClick={this.switchToPlayer.bind(this)} className="buttonColor navigation">Spieler Liste</button>
          <button onClick={this.handleOpenModalDate} className="buttonColor navigation">Termin hinzufügen</button>
        </div>
        <div className="today">
          <button onClick={this.goTodayAtend.bind(this)} className="buttonColor todayButton">Termin Heute: {today}</button>
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
                type="text"
                placeholder="Info"
              />
            </div>
            <div className="borderButton">
              <button  onClick={this.handleCloseModalDate} className="buttonColor">Abbrechen</button>
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

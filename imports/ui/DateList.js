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

 componentWillUnmount(){
      this.datesTracker.stop();
 }

// popup state für Termin hinzufuegen
 handleOpenModalDate () {
   this.setState({ showModalDate: true });
  }

  handleCloseModalDate () {
    this.setState({ showModalDate: false });
  }
  // popup state für Spieler hinzufuegen

  handleOpenModalPlayer () {
    this.setState({ showModalPlayer: true });
   }

   handleCloseModalPlayer () {
     this.setState({ showModalPlayer: false });
   }

//route zur anwesenheitsliste
   goToAtend(e) {
     let _id = e._id;
     this.props.history.push('/atendlist/' + _id);
   }

   switchToPlayer(){
     this.props.history.push('/playerslist/' + this.state.teamId);
   }

   switchToTeams(){
     this.props.history.push('/teampage');
   }

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



  render() {
    let dates = this.state.dates.map((date) =>{
        date.formatedDate = moment(date.date).format("DD.MM.YYYY");
        return  date;
    });
    let today = this.state.today;


    return(
      <div>
        <button onClick={this.switchToTeams.bind(this)}>Team Liste</button>
        <button onClick={this.switchToPlayer.bind(this)}>Spieler Liste</button>
        <button onClick={this.handleOpenModalDate}>Termin hinzufügen</button>
        <br/>
        <br/>

        <button onClick={this.goTodayAtend.bind(this)}>{today}</button>

        <br/>
        <br/>

        <ReactTable
          data = {dates}
          columns={[
            {
              Header: "Datum",
              Cell: (row) =>  <button onClick={() => {this.goToAtend(row.original);}}>{row.original.formatedDate}</button>,
            },
            {
              Header: "Art",
              accessor: "art",
            },
            {
              accessor: "date",
              show: false,

            },


          ]}
          defaultSorted={[
              {
                id: "date",
                desc: true
              }
          ]}

          className="-striped -highlight"
        />


        <Modal
          	isOpen={this.state.showModalDate}
            contentLabel="onRequestClose Example"
            onRequestClose={this.handleCloseModalDate}
            shouldCloseOnOverlayClick={false}
        >
          <p> Termin hinzufuegen</p>
          <form onSubmit={this.onSubmitDate.bind(this)}>
            <DateCalendar/>
            <NativeSelect name="art" >
              <option value={"Training"}>Training</option>
              <option value={"Spiel"}>Spiel</option>
              <option value={"Sonstiges"}>Sonstiges</option>
            </NativeSelect>
            <input type="text" name="info" placeholder="Info"/>
            <button type="submit" >OK!</button>
          </form>
          <button  onClick={this.handleCloseModalDate}>Abbrechen</button>
        </Modal>
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

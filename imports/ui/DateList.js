import React from "react";
import Modal from 'react-modal';
import {render} from "react-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import history from './../routes/AppRouter.js';
import createHistory from "history/createBrowserHistory";
import PropTypes from 'prop-types';

// import './../../client/main.html';
import AtendList from './AtendList.js';
import PlayersList from './PlayersList.js';

import {Dates} from '../api/dates.js';
import { Players } from './../api/players.js';

export default class DateList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dates: [],
      players:[],
      showModalDate: false,
      showModalPlayer: false,
      value: 0,
    }
    this.handleOpenModalDate = this.handleOpenModalDate.bind(this);
    this.handleCloseModalDate = this.handleCloseModalDate.bind(this);

    this.handleOpenModalPlayer = this.handleOpenModalPlayer.bind(this);
    this.handleCloseModalPlayer = this.handleCloseModalPlayer.bind(this);
  }
  componentDidMount(){
    this.datesTracker = Tracker.autorun(() => {
        Meteor.subscribe("dates");
        const dates = Dates.find().fetch();
        this.setState({ dates });

        Meteor.subscribe("players");
        const players = Players.find().fetch();
        this.setState({ players });
      }
    );
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
     this.props.history.push('/playerslist');
   }


  onSubmitDate = (e) => {
     e.preventDefault();
     let date = {
                  date: e.target.date.value,
                  art: e.target.art.value,
                  info: e.target.info.value,
                };
    Meteor.call('onSubmitDate', date);
    e.target.date.value = "";
    e.target.art.value = "";
    e.target.info.value = "";
    this.handleCloseModalDate();
  }

  onSubmitPlayer = (e) => {
     e.preventDefault();
     let player = {
                    name: e.target.name.value,
                    phoneNumber: e.target.phone.value,
                  };
     Meteor.call('onSubmitPlayer', player)
     e.target.name.value = "";
     this.handleCloseModalPlayer();
  }


  dateDelete(e) {
    Meteor.call('dateDelete', e);
  }



  render() {
    let dates = this.state.dates;
    let players = this.state.players;


    return(
      <div>
        <button onClick={this.switchToPlayer.bind(this)}>Spieler Liste</button>
        <button onClick={this.handleOpenModalDate}>Termin hinzufügen</button>
        <button onClick={this.handleOpenModalPlayer}>Spieler hinzufügen</button>
        <p> {players.name} </p>
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
                          Header: "Spieler",
                          width: 65,
                          Cell: (row) =>  <button  onClick={() => {this.goToAtend(row.original);}}>&#x2295;</button>,
                          style: {
                            cursor: "pointer",
                            fontSize: 25,
                            padding: "0",
                            textAlign: "center",
                            userSelect: "none"
                          },
                        },
                        {
                          Header: "Absagen",
                          width: 65,
                          Cell: (row) =>  <button  onClick={() => {this.dateDelete(row.original)}}>-</button>,
                          },
                        ]}
                        defaultPageSize={10}
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
                  <input type="text" name="date" placeholder="date"  />
                  <input type="text" name="art" placeholder="Art"/>
                  <input type="text" name="info" placeholder="Info"/>
                  <button type="submit" >OK!</button>
                </form>
                <button  onClick={this.handleCloseModalDate}>Abbrechen</button>
        </Modal>

        <Modal
           isOpen={this.state.showModalPlayer}
           contentLabel="onRequestClose Example"
           onRequestClose={this.handleCloseModalPlayer}
           shouldCloseOnOverlayClick={false}
        >
          <p> Spieler hinzufuegen</p>
          <form onSubmit={this.onSubmitPlayer.bind(this)}>
            <input type="text" name="name" placeholder="name"/>
            <input type="text" name="phone" placeholder="phone"/>
            <button type="submit">OK!</button>
          </form>
          <button  onClick={this.handleCloseModalPlayer}>Abbrechen</button>,

        </Modal>


      </div>

    );
  }
}
DateList.propTypes = {
  history: PropTypes.object
}

DateList.defaultProps = {
  history: history
};

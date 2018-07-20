import React from "react";
import Modal from 'react-modal';
import {render} from "react-dom";

// import './../../client/main.html';

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


 handleOpenModalDate () {
   this.setState({ showModalDate: true });
  }

  handleCloseModalDate () {
    this.setState({ showModalDate: false });
  }

  handleOpenModalPlayer () {
    this.setState({ showModalPlayer: true });
  }

  handleCloseModalPlayer () {
     this.setState({ showModalPlayer: false });
  }


    onSubmitDate = (e) => {
       e.preventDefault();
       let date = {
                    date: e.target.date.value,
                    art: e.target.art.value,
                    info: e.target.info.value,
                  };
       // Meteor.call('onSubmitDate', date);
       e.target.date.value = "";
       e.target.art.value = "";
       e.target.info.value = "";
       this.handleCloseModalDate();
    }


  render() {
    let dates = this.state.dates;
    let players = this.state.players;


    return(
      <div>
        <button onClick={this.handleOpenModalDate}>Termin hinzufügen</button>

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
      </div>

    );
  }
}

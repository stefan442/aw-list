import React from "react";
import Modal from 'react-modal';
import {render} from "react-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";


import {Dates} from '../api/dates.js';
import { Players } from './../api/players.js';

export default class PlayersList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dates: [],
      players:[],
      showModalDate: false,
      showModalPlayer: false,
      value: 0,
    }
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

                  };
      Meteor.call('onSubmitPlayer', player)
      e.target.name.value = "";
      this.handleCloseModalPlayer();
    }


      render() {
        let dates = this.state.dates;
        let players = this.state.players;


        return(
          <div>
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

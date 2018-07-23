import React from "react";
import Modal from 'react-modal';
import {render} from "react-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import history from './../routes/AppRouter.js';
import createHistory from "history/createBrowserHistory";
import PropTypes from 'prop-types';

import DateList from './DateList.js';

import { Dates } from '../api/dates.js';
import { Players } from './../api/players.js';

export default class PlayersList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      players:[],
      showModalDate: false,
      showModalPlayer: false,
      value: 0,
    }
    this.handleOpenModalPlayer = this.handleOpenModalPlayer.bind(this);
    this.handleCloseModalPlayer = this.handleCloseModalPlayer.bind(this);
  }

  componentDidMount(){
    this.datesTracker = Tracker.autorun(() => {
        Meteor.subscribe("players");
        const players = Players.find().fetch();
        this.setState({ players });
      }
    );
  }
  switchToDates(){
    this.props.history.push('/datelist');
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
    playerDelete(e) {
      Meteor.call('playerDelete', e);
    }
    goToPlayerProfil(e){
      let _id = e._id;
      this.props.history.push('/playerprofil/' + _id);
    }

    render() {
      let players = this.state.players;


      return(
        <div>
          <button onClick={this.switchToDates.bind(this)}>Termin Liste</button>
          <button onClick={this.handleOpenModalPlayer}>Spieler hinzufügen</button>
          <p> {players.name} </p>
          <ReactTable
            data = {players}
            columns={[
              {
                Header: "Name",
                Cell: (row) => <button onClick={() => {this.goToPlayerProfil(row.original);}}>{row.original.name}</button>,
              },
              {
                Header: "Anwesenheit",
                accessor: "countAtend",
              },
              {
                Header: "Termine Gesamt",
                accessor: "countdays",
              },

              
              ]}
              defaultPageSize={10}
              className="-striped -highlight"
          />

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

DateList.propTypes = {
  history: PropTypes.object
}

DateList.defaultProps = {
  history: history
};

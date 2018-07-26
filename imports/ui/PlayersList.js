import React from "react";
import Modal from 'react-modal';
import ReactTable from "react-table";
import "react-table/react-table.css";
import {Players} from './../api/players.js';

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

  componentDidMount(){
    this.datesTracker = Tracker.autorun(() => {
        Meteor.subscribe("players");
        const players = Players.find({teamId: this.state.teamId}).fetch();
        this.setState({ players });
      }
    );
  }

  componentWillUnmount(){
      this.datesTracker.stop();
  }
  switchToDates(){
    this.props.history.push('/datelist/' + this.state.teamId);
  }

  handleOpenModalPlayer () {
    this.setState({ showModalPlayer: true });
  }

    handleCloseModalPlayer () {
       this.setState({ showModalPlayer: false });
    }

    onSubmitPlayer = (e) => {
      e.preventDefault();
      const today = moment().format("YYYY-MM-DD");
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

    goToPlayerProfil(e){
      let _id = e._id;
      this.props.history.push('/playerprofil/' + _id);
    }

    switchToTeams(){
      this.props.history.push('/teampage');
    }


    render() {
      let players = this.state.players;


      return(
        <div>
          <button onClick={this.switchToTeams.bind(this)}>Team Liste</button>

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
              {
                Header: "percentage",
                accessor: "playerRelAt",
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
            <button  onClick={this.handleCloseModalPlayer}>Abbrechen</button>

          </Modal>


        </div>

    );
  }
}

/*DateList.propTypes = {
  history: PropTypes.object
};

DateList.defaultProps = {
  history: history
};*/

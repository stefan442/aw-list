import React from "react";
import ReactTable from "react-table";
import {Dates} from '../api/dates.js';
import {Players} from './../api/players.js';
import {Atendence} from './../api/atendence.js';


export default class PlayerProfil extends React.Component{
  constructor(props) {
    super(props);
    let player = Players.findOne({_id: this.props.match.params._id});


    this.state = {
      player: player,
      atendence: [],
      dates: [],
    }
  }
  componentDidMount(){
  this.playersTracker = Tracker.autorun(() => {
      Meteor.subscribe("atendence");
      const atendence = Atendence.find({player: this.state.player._id}).fetch();
      this.setState({ atendence });

      Meteor.subscribe("dates");
      let dateId = atendence.map((atend) =>{return atend.date});
      const dates = Dates.find({_id: {$in: dateId}}).fetch();
      this.setState({ dates });

      }
    );
  }

  componentWillUnmount(){
    this.playersTracker.stop();
  }

  goToPlayersList() {

    this.props.history.push('/playerslist/' + this.state.player.teamId);
  }

  playerDelete(e) {
    Meteor.call('playerDelete', e);

    this.props.history.push('/playerslist/' + this.state.player.teamId);

  }

  render(){
    debugger;
    let player = this.state.player;
    let dates = this.state.dates;
    dates = dates.map((date) => {
      date.formatedDate = moment(date.date).format("DD.MM.YYYY");

      let atendDB = this.state.atendence.find((obj) => {
        if(obj.date === date._id){
          return obj;
        }
      });

      let atend = atendDB.atend;

      return {
        ...date,
        atend: atend + "",
      }
    });
    console.log(player.playerRelAt);
    return(
      <div>
      <h1>Spieler Profil</h1>
      <button onClick={this.goToPlayersList.bind(this)}>&#x2299;</button>
      <button onClick={() => {this.playerDelete(player)}}>-</button>,
      <p>Name: {player.name}</p>
      <p>Tel.Nr.: {player.phoneNumber}</p>
      <p>Anwesenheit: {player.playerRelAt} % </p>
      <ReactTable
        data = {dates}
          columns={[
            {
              Header: "Datum",
              accessor: "formatedDate",
            },
            {
              Header: "Art",
              accessor: "art",
            },
            {
              Header: "Anwesend",
              accessor: "atend",
            },

            ]}
            defaultPageSize={10}
            className="-striped -highlight"
          />

      </div>

    )
  }
}

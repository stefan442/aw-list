import React from "react";
import ReactTable from "react-table";
import {Dates} from '../api/dates.js';
import {Players} from './../api/players.js';
import {Atendence} from './../api/atendence.js';
import Header from './header.js';



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
  //Tracker zum laden der Atendence Saetze und Termine
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


  //stoppt den Tracker
  componentWillUnmount(){
    this.playersTracker.stop();
  }
//navigation zur Spielerliste zurueck
  goToPlayersList() {
    this.props.history.replace('/playerslist/' + this.state.player.teamId);
  }
//funktion zum methoden aufruf um einen spieler zu loeschen und anscgliessend zur Spieler liste navigieren
  playerDelete(e) {
    Meteor.call('playerDelete', e);
    this.props.history.replace('/playerslist/' + this.state.player.teamId);

  }

  render(){
    let player = this.state.player;
    let dates = this.state.dates;
    dates = dates.map((date) => {
      date.formatedDate = moment(date.date).format("DD.MM.YYYY");

      let atendDB = this.state.atendence.find((obj) => {
        if(obj.date === date._id){
          return obj;
        }
      });

      // let atend = false;
      let buttontext = "Nein";

      if(atendDB.atend){
        // atend = atendDB.atend;
        buttontext = "Ja";
      }
      return {
        ...date,
        atend: buttontext + "",
      }
    });
    let percentage = Math.round(this.state.player.playerRelAt);
    return(
      <div>
      <div>
        <Header/>
      </div>
      <div>
      <div className="playerprofilForm">
      <h1 className="smallHeaderText">Spieler Profil</h1>
      <div className="playerprofilButton">
      <button onClick={this.goToPlayersList.bind(this)} className="buttonColor playerprofilButtonBack">&#x2299;</button>
      <button onClick={() => {this.playerDelete(player)}} className="buttonColor playerprofilButtonDel">Spieler löschen</button>
      </div>
      <p>Name: {player.name}</p>
      <p>Tel.Nr.: {player.phoneNumber}</p>
      <p>Anwesenheit: {percentage} % </p>
      </div>
      <ReactTable
        data = {dates}
          columns={[
            {
              Header: "Datum",
              accessor: "formatedDate",
              sortable: false,
            },
            {
              Header: "Art",
              accessor: "art",
            },
            {
              Header: "Anwesend",
              accessor: "atend",
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

      </div>
    </div>

    )
  }
}

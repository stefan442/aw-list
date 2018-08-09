import {Meteor} from 'meteor/meteor';
import React from "react";
import PropTypes from 'prop-types';

import {TrainerTeam} from './../api/trainerTeam.js';

export default class MissingTrainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users:[],
      trainerTeam: [],
    }
  }
  //Tracker zum laden der Spieler
  componentDidMount(){
    this.userTracker = Tracker.autorun(() => {
        Meteor.subscribe("trainerTeam");
        const trainerTeam = TrainerTeam.find({team: this.props.team._id}).fetch();
        this.setState({ trainerTeam });

        Meteor.subscribe("users");
        const users = Meteor.users.find().fetch();
        this.setState({ users });
      }
    );
  }

  //stoppt den Tracker
  componentWillUnmount(){
    this.userTracker.stop();
  }

  deleteTrainerTeam(trainer){
    let del = {
      teamId: this.props.team._id,
      trainer: trainer,
    }
    Meteor.call('deleteTrainerTeam', del);
  }

  render(){
    let atendingTrainer = this.state.trainerTeam;
    atendingTrainer = atendingTrainer.map((trainer) =>{
      return trainer.trainer;
    })

    let users = this.state.users;
    users = users.filter((user) => {
      if((user._id != Meteor.userId()) && (atendingTrainer.includes(user._id))){
        return user;
      }
    });
    if(users && users.length !== 0){
      this.trainer = users.map((user) => {
        return (<div className="teamListCenteredFunc" key={user._id} >
          <p>{user.emails[0].address}</p>
          <button type="button" onClick={(e) =>{
            e.target.style.visibility='hidden';
            this.deleteTrainerTeam(user._id)}} className="buttonColor">  X  </button>
          </div>)
        })
    }
    return(
      <div>{this.trainer}</div>
    );
  }
}

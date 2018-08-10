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

  renderDeleteTrainerButton(userId){
    if(this.props.team.created == Meteor.userId()){
      return(
      <button type="button" onClick={(e) =>{
        e.target.style.visibility='hidden';
        this.deleteTrainerTeam(userId)}} className="buttonColor">  X  </button>
      )
    }
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
        return (
          <div className="teamListCenteredFunc" key={user._id} >
            <p>{user.username}</p>
            {this.renderDeleteTrainerButton(user._id)}
          </div>)
        })
    }
    return(
      <div>{this.trainer}</div>
    );
  }
}

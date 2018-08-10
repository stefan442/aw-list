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
  componentDidMount(){
    this.userTracker = Tracker.autorun(() => {
        Meteor.subscribe("users");
        const users = Meteor.users.find().fetch();
        this.setState({ users });

        Meteor.subscribe("trainerTeam");
        const trainerTeam = TrainerTeam.find({team: this.props.team._id}).fetch();
        this.setState({ trainerTeam });
      }
    );
  }
  componentWillUnmount(){
    this.userTracker.stop();
  }
  addTrainerTeam(trainer){
    let add = {
      teamId: this.props.team._id,
      trainer: trainer,
      created:  this.props.team.created,
    }
    Meteor.call('addTrainerTeam', add);
  }

  render(){
    let atendingTrainer = this.state.trainerTeam;
    atendingTrainer = atendingTrainer.map((trainer) =>{
      return trainer.trainer;
    })

    let users = this.state.users;
    users = users.filter((user) => {
      if((user._id == Meteor.userId()) || (atendingTrainer.includes(user._id))){
        return ;
      }
      return user;
    });
    if(users !== undefined && users.length !== 0){
      this.trainer = users.map((user) => {
        return (<div className="teamListCenteredFunc" key={user._id} >
          <button type="button" onClick={(e) =>{
            e.target.style.visibility='hidden';
            this.addTrainerTeam(user._id)}} className="buttonColor"> {user.emails[0].address} </button>
          </div>)
        })
    }
    return(
      <div>{this.trainer}</div>
    );
  }
}

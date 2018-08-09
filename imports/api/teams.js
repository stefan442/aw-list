import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {TrainerTeam} from './trainerTeam.js';

//ertellt Tabelle fuer Teams
export const Teams = new Mongo.Collection('teams');

if(Meteor.isServer){
  Meteor.publish("teams", function(){
    let userId = Meteor.userId();
    return Teams.find();
  });
}

Meteor.methods({
  //erstellt ein neues Team
  'teamAdd'(team){
    let userId = Meteor.userId();
    if(team){
      let id = Teams.insert({name: team});
      TrainerTeam.insert({team: id, trainer: userId});
    }
  }
});

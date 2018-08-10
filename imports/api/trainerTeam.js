import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

//ertellt Tabelle fuer TrainerTeams
export const TrainerTeam = new Mongo.Collection('trainerTeam');

if(Meteor.isServer){
  Meteor.publish("trainerTeam", function(){
    return TrainerTeam.find({});
  });
}

Meteor.methods({
  'addTrainerTeam'(add){
    TrainerTeam.insert({team: add.teamId, trainer: add.trainer, created: add.created});
  },
  'deleteTrainerTeam'(del){
    TrainerTeam.remove({team: del.teamId, trainer: del.trainer});
  },
});

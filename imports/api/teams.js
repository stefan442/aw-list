import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

//ertellt Tabelle fuer Teams
export const Teams = new Mongo.Collection('teams');

if(Meteor.isServer){
  Meteor.publish("teams", function(){
    let userId = Meteor.userId();
    return Teams.find({trainer: userId});
  });
}

Meteor.methods({
  //erstellt ein neues Team
  'teamAdd'(team){
    let userId = Meteor.userId();
    if(team){
      Teams.insert({name: team, trainer: userId});
    }
  }
});

import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

//ertellt Tabelle fuer Teams
export const Teams = new Mongo.Collection('teams');

if(Meteor.isServer){
  Meteor.publish("teams", function(){
    return Teams.find();
  });
}

Meteor.methods({
  //erstellt ein neues Team
  'teamAdd'(team){
    if(team){
      Teams.insert({name: team});
    }
  }
});

import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Teams = new Mongo.Collection('teams');

if(Meteor.isServer){
  Meteor.publish("teams", function(){
    return Teams.find();
  });
}

Meteor.methods({
    'teamAdd'(team){
      debugger;
      if(team){
        Teams.insert({
          name: team
        });
      }
    },

    //remove in methods mit allen tabellen
    'teamRemove'(teamID){
      Teams.remove({
        _id: teamID
      });
    }
});

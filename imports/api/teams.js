import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Teams = new Mongo.Collection('teams');

Meteor.methods({
    'teamAdd'(team){
      if(team){
        Teams.insert({
          name: team
        });
      }
    },
    'teamRemove'(teamID){
      Teams.remove({
        _id: teamID
      });
    }
});

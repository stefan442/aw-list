import {Meteor} from "meteor/meteor";
import {Mongo} from 'meteor/mongo';


//Collection für Spieler
export const Players = new Mongo.Collection('players');

if(Meteor.isServer){
  Meteor.publish("players", function(){
    return Players.find();
  });
}

Meteor.methods({

  'onSubmitPlayer' (playerInsert){
    if (playerInsert.name){
      Players.insert({"name": playerInsert.name, "phoneNumber": playerInsert.phoneNumber, "countAtend": 0, "countDays": 0, "teamId": playerInsert.teamId});
    }
  }

});

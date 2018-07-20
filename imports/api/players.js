import { Meteor } from "meteor/meteor";
import {Mongo} from 'meteor/mongo';


//Collection für Spieler
export const Players = new Mongo.Collection('players');

if(Meteor.isServer){
  Meteor.publish("players", function(){
    return Players.find();
  });
}

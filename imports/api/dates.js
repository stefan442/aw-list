import { Meteor } from "meteor/meteor";
import {Mongo} from 'meteor/mongo';

//collection für Termine
export const Dates = new Mongo.Collection('dates');

if(Meteor.isServer){
  Meteor.publish("dates", function(){
    return Dates.find();
  });
}

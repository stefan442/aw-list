import { Meteor } from "meteor/meteor";
import {Mongo} from 'meteor/mongo';

//Tabelle für Anwesenheitssaetze
export const Atendence = new Mongo.Collection('atendence');
if(Meteor.isServer){
  Meteor.publish("atendence", function(){
    return Atendence.find();
  });
}

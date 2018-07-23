import { Meteor } from "meteor/meteor";
import {Mongo} from 'meteor/mongo';

import './methods.js'

//collection für Termine
export const Dates = new Mongo.Collection('dates');

if(Meteor.isServer){
  Meteor.publish("dates", function(){
    return Dates.find();
  });
}


Meteor.methods({
  'onSubmitDate' (dateRow){
    let id;
    if (dateRow.date && dateRow.art){
      id = Dates.insert({"date": dateRow.date, "art": dateRow.art, "info": dateRow.info});

    }

    Meteor.call('createAtendence', id);

  },

})
;

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
    let today = moment().format("YYYY-MM-DD");
    if (dateRow.date && dateRow.art){
      id = Dates.insert({"date": dateRow.date, "art": dateRow.art, "info": dateRow.info, "teamId": dateRow.teamId});

    }

    if(dateRow.date >= today){

      Meteor.call('createAtendence', {dateId: id, teamId: dateRow.teamId});

    }


  },

})
;

import { Meteor } from "meteor/meteor";
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
  },
  //
  // 'players.find'({_id, name, phoneNumber, countAtend, countDays}){
  //   let query = {};
  //   if(_id){
  //     query._id = _id;
  //
  //   }
  //   if(name){
  //     query.name = name;
  //
  //   }
  //   if(phoneNumber){
  //         query.phoneNumber = phoneNumber;
  //
  //   }
  //   if(countAtend){
  //     query.countAtend = countAtend;
  //
  //   }
  //   if(countDays){
  //     query.countDays = countDays;
  //
  //   }
  //
  //   let players = Players.find(query).fetch();
  //
  //   return players;
  //
  // }

})

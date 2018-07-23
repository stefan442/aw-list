import { Meteor } from "meteor/meteor";

import {Dates} from './dates.js';
import {Players} from './players.js';
import {Atendence} from './atendence.js';


Meteor.methods({
  'createAtendence' (dateId){
    let players = Players.find().fetch();
      let atendence = Atendence.find({date: dateId}).fetch();
        if(atendence == undefined || atendence.length <= 0){
            players = players.map((player) =>{
                Atendence.insert({"date": dateId, "player": player._id, "atend": false});
                Players.update({_id: player._id}, {$inc: {"countdays": 1}});
                return player;
            }

          );
        }
        else{
          if(!(players.length == atendence.length)){
            players = players.map((player) =>{
              let playerExist = atendence.find((obj) => {
                if(obj.player == player._id){
                  return obj;
                }
              }
            );

            if(playerExist == undefined ) {
              Atendence.insert({"date": dateId, "player": player._id, "atend": false, "buttontext": "false" });
              Players.update({_id: player._id}, {$inc: {"countdays": 1}});
              }
          }
        );
      }
    }
  },
  'dateDelete' (dateRow){

     let players = Players.find().fetch();
     let atendences = Atendence.find({date: dateRow._id}).fetch();
     players = players.map((player) =>{
       if(player.countdays > 0){
         Players.update({_id: player._id}, {$inc: {"countdays": -1}});
       }
     });
     atendences = atendences.map((atendenceOne) => {
       if (atendenceOne.atend){
         Players.update({_id: atendenceOne.player}, {$inc: {"countAtend": -1}});
       }
     })
     Dates.remove({_id: dateRow._id});
     Atendence.remove({date: dateRow._id});

  },
  'toggleAtendence' ({playerRow, today}){
    let atendence = Atendence.findOne({player: playerRow._id, date: today});
    atendence.atend = !atendence.atend;
    Atendence.update({player: playerRow._id, date: today}, {$set: {atend: atendence.atend}});
    atendence.buttontext = atendence.atend + "";
    if(atendence.atend){
      Players.update({_id: playerRow._id}, {$inc: {countAtend: 1}});

    }
    else{
      Players.update({_id: playerRow._id}, {$inc: {countAtend: -1}});
    }
  },

})
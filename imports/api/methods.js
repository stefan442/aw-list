import { Meteor } from "meteor/meteor";

import {Dates} from './dates.js';
import {Players} from './players.js';
import {Atendence} from './atendence.js';
import {Teams} from './teams.js';

Meteor.methods({
  'createAtendence' ({dateId, teamId}){
    let players = Players.find().fetch();
      let atendence = Atendence.find({date: dateId}).fetch();
        if(atendence == undefined || atendence.length <= 0){
            players = players.map((player) =>{
                Atendence.insert({"date": dateId, "player": player._id, "atend": false, "teamId": teamId});
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
              Atendence.insert({"date": dateId, "player": player._id, "atend": false, "buttontext": "false", "teamId": teamId });
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
     let playerRelAt;
    if(atendence.atend){
      playerRelAt = (playerRow.countAtend + 1) / playerRow.countdays * 100;
      Players.update({_id: playerRow._id}, {$inc: {countAtend: 1}, $set: {playerRelAt: playerRelAt}});

    }
    else{
      playerRelAt = (playerRow.countAtend - 1) / playerRow.countdays * 100;
      Players.update({_id: playerRow._id}, {$inc: {countAtend: -1}, $set: {playerRelAt: playerRelAt}});
    }
  },
  'playerDelete'(playerRow){

    Atendence.remove({player: playerRow._id});
    Players.remove({_id: playerRow._id});
  },
  'updateAtendence'(atendenceInsert){
    Atendence.insert({"date": atendenceInsert.date, "player": atendenceInsert.player, "atend": false, "teamId": atendenceInsert.teamId});
    Players.update({_id: atendenceInsert.player}, {$inc: {"countdays": 1}} );
  },

  'onSubmitPlayer' (playerInsert){
    let id;
    if (playerInsert.name){
      id = Players.insert({"name": playerInsert.name, "phoneNumber": playerInsert.phoneNumber, "countAtend": 0, "countdays": 0, "teamId": playerInsert.teamId, "playersRelAt": 0});
    }
    let dates = Dates.find({date: {$gte: playerInsert.today}}).fetch();
    let count = 0;
    dates = dates.map((date) =>{


        count++;
        Atendence.insert({"date": date._id, "player": id, "atend": false, "teamId": date.teamId});

    });
    Players.update({_id: id}, {$inc: {"countdays": count}} );


  },

  'teamFullRemove' (teamId){
      Atendence.remove({
        teamId: teamId
      });
      Dates.remove({
        teamId: teamId
      });
      Players.remove({
        teamId: teamId
      });
      Teams.remove({
        _id: teamId
      });
  },
})

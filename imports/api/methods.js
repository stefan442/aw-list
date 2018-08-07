import {Meteor} from "meteor/meteor";
import moment from 'moment';

import {Dates} from './dates.js';
import {Players} from './players.js';
import {Atendence} from './atendence.js';
import {Teams} from './teams.js';

Meteor.methods({
  //erzeugt Atendence- Sätze bei der Termin erstellung
  //Setzt in der Atendence Tabelle die Anwesenheit defaultmaessig auf true
  //countdays wird nicht mehr benoetigt im finalen Programm
  'createAtendence' ({dateId, teamId}){
      let players = Players.find({teamId: teamId}).fetch();
      let atendence = Atendence.find({date: dateId, teamId: teamId}).fetch();
      let actualDay = moment().format("YYYY-MM-DD");
      if(atendence === undefined || atendence.length <= 0){
        players = players.map((player) =>{
          let thisDate = Dates.findOne({_id: dateId, date: {$lte: actualDay}});
          if(thisDate){
            let atendenceDates = Dates.find({date: {$lte: actualDay}, teamId: teamId}).fetch();
            atendenceDates = atendenceDates.map((date) => {
              return date._id;
            })
            let count = Atendence.find({date: {$in: atendenceDates}}).count();
            let dates = Dates.find({date: {$lt: actualDay, $gte: thisDate.date}, teamId: teamId}).fetch();
            dates = dates.map((date) => {
              let existAtendence = Atendence.findOne({date: date._id, player: atendenceInsert.player});
              if(existAtendence == undefined){
                count++;
              }
            });
            let playerRelAt = (player.countAtend + 1) / (count + 1) * 100;
            Players.update({_id: player._id},  {$inc: {"countAtend": +1}, $set: {playerRelAt: playerRelAt}});
            Atendence.insert({"date": dateId, "player": player._id, "atend": true, "teamId": teamId});//true
            return player;
          }
          else{
            Atendence.insert({"date": dateId, "player": player._id, "atend": true, "teamId": teamId});//true
          }
        });
      }
      else{
        if(!(players.length === atendence.length)){
          players = players.map((player) =>{
            let playerExist = atendence.find((obj) => {
              if(obj.player === player._id){
                return obj;
              }
            });
            if(playerExist === undefined){
              players = players.map((player) =>{
                let thisDate = Dates.findOne({_id: dateId, date: {$lte: actualDay}});
                if(thisDate){
                  let atendenceDates = Dates.find({date: {$lte: actualDay}, teamId: teamId}).fetch();
                  atendenceDates = atendenceDates.map((date) => {
                    return date._id;
                  })
                  let count = Atendence.find({date: {$in: atendenceDates}}).count();
                  let dates = Dates.find({date: {$lt: actualDay, $gte: thisDate.date}, teamId: teamId}).fetch();
                  dates = dates.map((date) => {
                    let existAtendence = Atendence.findOne({date: date._id, player: atendenceInsert.player});
                    if(existAtendence == undefined){
                      count++;
                    }
                  });
                  let playerRelAt = (player.countAtend + 1) / (count + 1) * 100;
                  Players.update({_id: player._id},  {$inc: {"countAtend": +1}, $set: {playerRelAt: playerRelAt}});
                  Atendence.insert({"date": dateId, "player": player._id, "atend": true, "teamId": teamId});//true
                  return player;
                }
              });
              Atendence.insert({"date": dateId, "player": player._id, "atend": true, "teamId": teamId });
            }
          });
        }
      }
    },

//loescht einen Termin auf der Dates Tabelle und die zugehoerigen Atendence Saetze zu diesen Termine
//updatet bei allen Spielern ihre Anwesenheit
  'dateDelete' (dateRow){
     let atendences = Atendence.find({date: dateRow._id}).fetch();
     let today = moment().format("YYYY-MM-DD");
     let countDates = Dates.find({date: {$lte: today}, teamId: dateRow.teamId}).fetch();
     countDates = countDates.map((date) => {
       return date._id;
     })
     let count = 0;
     atendences = atendences.map((atendence) => {
       let player = Players.findOne({_id: atendence.player});
       count = Atendence.find({date: {$in: countDates}, player: player._id}).count();
       if((atendence.atend) && (dateRow.date <= today)){
         if((count - 1) > 0){
           playerRelAt = (player.countAtend - 1) / (count - 1) * 100;
         }
         else{
            playerRelAt = 0;
         }
         Players.update({_id: player._id},  {$inc: {"countAtend": -1}, $set: {playerRelAt: playerRelAt}});
       }
       else{
         if((count - 1) > 0){
           playerRelAt = (player.countAtend) / (count - 1) * 100;
         }
         else{
           playerRelAt = 0;
         }
         Players.update({_id: player._id}, {$set: {playerRelAt: playerRelAt}});
       }
     });
     Atendence.remove({date: dateRow._id});
     Dates.remove({_id: dateRow._id});
  },
  //Setzt in der Atendence Tabelle fuer die Anwesenheit auf true/false
  'toggleAtendence' ({playerRow, today}){
    let actualDay = moment().format("YYYY-MM-DD");
    let atendence = Atendence.findOne({player: playerRow._id, date: today});
    atendence.atend = !atendence.atend;
    Atendence.update({date: today, player: playerRow._id}, {$set: {atend: atendence.atend}});
    let playerRelAt = 0;
    let dates = Dates.find({date: {$lte: actualDay}, teamId: playerRow.teamId}).fetch();
    dates = dates.map((date) => {
      return date._id;
    });

    let count = Atendence.find({date: {$in: dates}, player: playerRow._id}).count();
    if(atendence.atend){
      if(count > 0){
        playerRelAt = (playerRow.countAtend + 1) / count * 100;
      }
      else{
        playerRelAt = 0;
      }
      Players.update({_id: playerRow._id}, {$inc: {countAtend: 1}, $set: {playerRelAt: playerRelAt}});
    }
    else{
      if(count > 0){
        playerRelAt = (playerRow.countAtend - 1) / count * 100;
      }
      else{
        playerRelAt = 0;
      }
      Players.update({_id: playerRow._id}, {$inc: {countAtend: -1}, $set: {playerRelAt: playerRelAt}});
    }
  },
  //loescht einen Spieler mit seinen zugehoerigen Atendence Saetzen
  'playerDelete'(playerRow){
    Atendence.remove({player: playerRow._id});
    Players.remove({_id: playerRow._id});
  },
  //erstellt fuer einen neuen spieler rueckwirkend neue atendence Saetze ab einen Termin in der Vergangenheit der seine erste Anwesenheit war
  'updateAtendence'(atendenceInsert){
    let actualDay = moment().format("YYYY-MM-DD");
    let thisDate = Dates.findOne({_id: atendenceInsert.date, date: {$lt: actualDay}});

    if(thisDate){
      let atendenceDates = Dates.find({date: {$lte: actualDay}, teamId: atendenceInsert.teamId}).fetch();
      atendenceDates = atendenceDates.map((date) => {
        return date._id;
      });
      let count = Atendence.find({date: {$in: atendenceDates}, player: atendenceInsert.player}).count();
      let dates = Dates.find({date: {$lt: actualDay, $gte: thisDate.date}, teamId: atendenceInsert.teamId}).fetch();
      dates = dates.map((date) => {
        let existAtendence = Atendence.findOne({date: date._id, player: atendenceInsert.player});
        if(existAtendence == undefined){
          Players.update({_id: atendenceInsert.player},  {$inc: {"countAtend": +1}});
          Atendence.insert({"date": date._id, "player": atendenceInsert.player, "atend": true, "teamId": atendenceInsert.teamId});
          count++;
        }
      });
      let player = Players.findOne({_id: atendenceInsert.player});
      let playerRelAt = (player.countAtend) / count * 100;
      Players.update({_id: atendenceInsert.player}, {$set: {"playerRelAt": playerRelAt}} );
    }
  },
//erstellt einen neuen Spieler und erzeugt neu Atendence Saetze ab dem heutigen Tag oder ab einem ausgewählten Termin
  'onSubmitPlayer' (playerInsert){
    let id;
    let actualDay = moment().format("YYYY-MM-DD");
    if (playerInsert.name){
      id = Players.insert({"name": playerInsert.name, "phoneNumber": playerInsert.phoneNumber, "countAtend": 0, "teamId": playerInsert.teamId, "playerRelAt": 0});
    }
    let compareDate = Dates.findOne({date: playerInsert.today});
    let date = [];
    if(compareDate == undefined){
      dates = Dates.find({date: {$gt: playerInsert.today}, teamId: playerInsert.teamId}).fetch();
      dates = dates.map((date) =>{
          Atendence.insert({"date": date._id, "player": id, "atend": true, "teamId": date.teamId});
      });
    }
    else if(compareDate.date == actualDay){
      dates = Dates.find({date: {$gte: playerInsert.today}, teamId: playerInsert.teamId}).fetch();
      dates = dates.map((date) =>{
          Atendence.insert({"date": date._id, "player": id, "atend": true, "teamId": date.teamId});
      });
      Players.update({_id: id}, {$inc: {"countAtend": +1}, $set: {"playerRelAt": 100}});
    }
  else{
    dates = Dates.find({date: {$gte: actualDay}, teamId: playerInsert.teamId}).fetch();
    dates = dates.map((date) =>{
        Atendence.insert({"date": date._id, "player": id, "atend": true, "teamId": date.teamId});
    });
    Players.update({_id: id},  {$inc: {"countAtend": +1}});
      let newAtend ={
        player: id,
        date: compareDate._id,
        teamId: playerInsert.teamId,
      };
      Meteor.call('updateAtendence', newAtend);
    }
  },
//loescht ein gesamtes Team mit allen dazugehoerigen Atendence Saetzen, Terminen und Spielern
  'teamFullRemove' (teamId){
    Atendence.remove({teamId: teamId});
    Dates.remove({teamId: teamId});
    Players.remove({teamId: teamId});
    Teams.remove({_id: teamId});
  },
  'updatePercentage'(teamId){
    debugger;
    let today =  moment().format("YYYY-MM-DD");
    let todayDate = Dates.findOne({date: today, teamId: teamId});
    if(todayDate){
      let count = 0;
      let dates = Dates.find({date: {$lte: today}, teamId: teamId}).fetch();
      let datesId = dates.map((date) => {
        return date._id;
      });
      players = Players.find({teamId: teamId}).fetch();
      players.map((player) => {
        count = Atendence.find({date: {$in: datesId}, player: player._id}).count();
        let playerRelAt;
        if(count > 0){
          playerRelAt = (player.countAtend + 1) / count * 100;
        }
        else{
          playerRelAt = 0;
        }
        Players.update({_id: player._id}, {$inc: {"countAtend": +1}, $set: {"playerRelAt": playerRelAt}});
      });
    }
  },
});

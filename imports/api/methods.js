import {Meteor} from "meteor/meteor";
import moment from 'moment';

import {Dates} from './dates.js';
import {Players} from './players.js';
import {Atendence} from './atendence.js';
import {Teams} from './teams.js';

Meteor.methods({
  //erzeugt Atendence- Sätze bei der Termin erstellung
  //Setzt in der Atendence Tabelle die Anwesenheit defaultmaessig auf false
  //countdays wird nicht mehr benoetigt im finalen Programm
  'createAtendence' ({dateId, teamId}){
    let players = Players.find().fetch();
      let atendence = Atendence.find({date: dateId}).fetch();
      let actualDay = moment().format("YYYY-MM-DD");
        if(atendence === undefined || atendence.length <= 0){
            players = players.map((player) =>{
              let thisDate = Dates.findOne({_id: dateId, date: {$lte: actualDay}});
              if(thisDate){
                let atendenceDates = Dates.find({date: {$lte: actualDay}});
                  atendenceDates = atendenceDates.map((date) => {
                    return date._id;
                  })
                let count = Atendence.find({date: {$in: atendenceDates}}).count();
                let dates = Dates.find({date: {$lt: actualDay, $gte: thisDate.date}}).fetch();
                dates = dates.map((date) => {
                  let existAtendence = Atendence.findOne({date: date._id, player: atendenceInsert.player});
                  if(existAtendence == undefined){
                      count++;
                  }
                });
                let playerRelAt = (player.countAtend) / (count + 1) * 100;
                Players.update({_id: player._id}, {$set: {"playerRelAt": playerRelAt}} );
                Atendence.insert({"date": dateId, "player": player._id, "atend": false, "teamId": teamId});
                return player;
            }
          }
          );
        }
        else{
          if(!(players.length === atendence.length)){
            players = players.map((player) =>{
              let playerExist = atendence.find((obj) => {
                if(obj.player === player._id){
                  return obj;
                }
              }
            );
            if(playerExist === undefined){
              players = players.map((player) =>{
                let thisDate = Dates.findOne({_id: dateId, date: {$lte: actualDay}});
                if(thisDate){
                  let atendenceDates = Dates.find({date: {$lte: actualDay}});
                    atendenceDates = atendenceDates.map((date) => {
                      return date._id;
                    })
                  let count = Atendence.find({date: {$in: atendenceDates}}).count();
                  let dates = Dates.find({date: {$lt: actualDay, $gte: thisDate.date}}).fetch();
                  dates = dates.map((date) => {
                    let existAtendence = Atendence.findOne({date: date._id, player: atendenceInsert.player});
                    if(existAtendence == undefined){
                        count++;
                    }
                  });
                  let playerRelAt = (player.countAtend) / (count + 1) * 100;
                  Players.update({_id: player._id}, {$set: {"playerRelAt": playerRelAt}} );
                  Atendence.insert({"date": dateId, "player": player._id, "atend": false, "teamId": teamId});
                  return player;
              }
            }
            );
              Atendence.insert({"date": dateId, "player": player._id, "atend": false, "buttontext": "false", "teamId": teamId });
            }
          }
        );
      }
    }
  },

//loescht einen Termin auf der Dates Tabelle und die zugehoerigen Atendence Saetze zu diesen Termine
//updatet bei allen Spielern ihre Anwesenheit
  'dateDelete' (dateRow){
     let atendences = Atendence.find({date: dateRow._id}).fetch();
     // let actualDay = dateRow.date;
     let today = moment().format("YYYY-MM-DD");
     let countDates = Dates.find({date: {$lte: today}}).fetch();
     countDates = countDates.map((date) => {
       return date._id;
     })

     let count = Atendence.find({date: {$in: countDates}}).count();
     atendences = atendences.map((atendence) => {
       let player = Players.findOne({_id: atendence.player});

       if((atendence.atend) && (dateRow.date <= today)){
         if((count - 1) != 0){
           playerRelAt = (player.countAtend - 1) / (count - 1) * 100;
         }
         else{
            playerRelAt = 0;
         }
         Players.update({_id: player._id},  {$inc: {"countAtend": -1}, $set: {playerRelAt: playerRelAt}});
       }
       else{
         if((count - 1) != 0){
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
    Atendence.update({player: playerRow._id, date: today}, {$set: {atend: atendence.atend}});
    atendence.buttontext = atendence.atend + "";
    let playerRelAt = 0;
    let dates = Dates.find({date: {$lte: actualDay}}).fetch();
    dates = dates.map((date) => {
        return date._id;
    })

    let count = Atendence.find({date: {$in: dates}, player: playerRow._id}).count();
    if(atendence.atend){
      if(count != 0){
        playerRelAt = (playerRow.countAtend + 1) / count * 100;
      }
      else{
        	playerRelAt = 0;
      }
      Players.update({_id: playerRow._id}, {$inc: {countAtend: 1}, $set: {playerRelAt: playerRelAt}});

    }
    else{

      if(count != 0){
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
      let atendenceDates = Dates.find({date: {$lte: actualDay}}).fetch();
        atendenceDates = atendenceDates.map((date) => {
          return date._id;
        })


      let count = Atendence.find({date: {$in: atendenceDates}}).count();
      let dates = Dates.find({date: {$lt: actualDay, $gte: thisDate.date}}).fetch();
      dates = dates.map((date) => {
        let existAtendence = Atendence.findOne({date: date._id, player: atendenceInsert.player});
        if(existAtendence == undefined){
            Atendence.insert({"date": date._id, "player": atendenceInsert.player, "atend": false, "teamId": atendenceInsert.teamId});
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
    if (playerInsert.name){
      id = Players.insert({"name": playerInsert.name, "phoneNumber": playerInsert.phoneNumber, "countAtend": 0, "teamId": playerInsert.teamId, "playerRelAt": 0});
    }
    let dates = Dates.find({date: {$gte: playerInsert.today}}).fetch();
    let count = 0;
    dates = dates.map((date) =>{


        count++;
        Atendence.insert({"date": date._id, "player": id, "atend": false, "teamId": date.teamId});

    });


  },
//loescht ein gesamtes Team mit allen dazugehoerigen Atendence Saetzen, Terminen und Spielern
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
});

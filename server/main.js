import {Meteor} from 'meteor/meteor';
import {SyncedCron} from 'meteor/percolatestudio:synced-cron';

//import datenbanktabelle für methoden/datenbank aufruf
import "../imports/api/users.js";
import { Teams } from "../imports/api/teams.js";

import "../imports/startup/simple-schema-configuration.js";
import "../imports/api/methods.js"

if(Meteor.isServer){ 

  SyncedCron.add({
    name: 'Prozentsaetze updaten',
    schedule: function(parser) {
      // parser is a later.parse object
      // return parser.text('every 5 seconds');
      // Berechnet an der Angegeben Uhrzeit die relAt Prozentsätze für den
      // Termin der heute stattfindet fals dieser in der Vergangenheit erstellt wurde
      // Vorausgesetz Meteor Läuft am rechner zu dieser Zeit
      // UTC TIME BEACHTEN (nur am Server)
      return parser.recur().on('09:00:00').time();
    },
    utc: false,
    job: function() {
      console.log("job start");
      let teams = Teams.find().fetch();
      teams = teams.map((team) =>{
        Meteor.call('updatePercentage', team._id);
      });
    }
  });
}

Meteor.startup(() => {
  if(Meteor.isServer){ 
    Meteor.startup(function () { 
      SyncedCron.start();
      WebApp.connectHandlers.use(function (req, res, next) {
        res.setHeader('access-control-allow-origin', '*'); 
        return next(); 
      }) 
    }) 
  }
});

import {Meteor} from 'meteor/meteor';
import {SyncedCron} from 'meteor/percolatestudio:synced-cron';

//import datenbanktabelle für methoden/datenbank aufruf
import "../imports/api/users.js";
import { Teams } from "../imports/api/teams.js";

import "../imports/startup/simple-schema-configuration.js";
import "../imports/api/methods.js"

SyncedCron.add({
  name: 'Prozentsaetze updaten',
  schedule: function(parser) {
// parser is a later.parse object
// return parser.text('every 5 seconds');
//UTC TIME BEACHTEN
    return parser.recur().on('08:00:00').time();
  },
  job: function() {
    console.log("job start");
    let teams = Teams.find().fetch();
    teams = teams.map((team) =>{
      Meteor.call('updatePercentage', team._id);
    });
  }
});

Meteor.startup(() => {
  if(Meteor.isServer){ 
    Meteor.startup(function () { 
      SyncedCron.start();
      WebApp.connectHandlers.use(function (req, res, next) {
         res.setHeader('access-control-allow-origin', '*'
      ); 
        return next(); 
      }) 
    }) 
  }
});

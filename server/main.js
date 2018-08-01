import {Meteor} from 'meteor/meteor';
//import datenbanktabelle für methoden/datenbank aufruf
import "../imports/api/users.js";
import "../imports/startup/simple-schema-configuration.js";
import "../imports/api/methods.js"

Meteor.startup(() => {
  if(Meteor.isServer){ 
    Meteor.startup(function () { 
      WebApp.connectHandlers.use(function (req, res, next) {
         res.setHeader('access-control-allow-origin', '*'
      ); 
        return next(); 
      }) 
    }) 
  }
});

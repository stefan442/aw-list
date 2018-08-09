import {Meteor} from 'meteor/meteor';
import {Accounts} from "meteor/accounts-base";

import {signupSchema} from "./schemas.js";


if(Meteor.isServer){
  Meteor.publish("users", function(){
    return Meteor.users.find();
  });
}
// Überprüfung bei Signup ob Email das richtige Format hat
Accounts.validateNewUser((user) => {
  const email = user.emails[0].address;
  signupSchema.validate({email});
  return true;
});

import { Meteor } from 'meteor/meteor';
import { Accounts } from "meteor/accounts-base";

import { signupSchema } from "./schemas.js";

Accounts.validateNewUser((user) => {

  const email = user.emails[0].address;

  signupSchema.validate({email});

  return true;
});

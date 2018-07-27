import SimpleSchema from "simpl-schema";

// Schema zum Überprüfen der Email
export const signupSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  }
});

signupSchema.messageBox.messages({
en: {
   regEx: 'Die Email ist ungültig',
},
});

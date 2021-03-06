const functions = require('firebase-functions');
const admin = require('firebase-admin');
const _ = require('lodash');

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

exports.addDoctor = functions.https.onCall((data, context) => {
    const {email} = data;
    return grantTeacherRole(email).then((result)=> {
        return {
            result: `Request is fulfilled ${email} is now a doctor!`
        }
    })
})

async function grantTeacherRole(email) {
  const user = await admin.auth().getUserByEmail(email);
  //custom claims check
  if (user.customClaims && _.isEmpty(user.customClaims)) {
    return;
  }
  return admin.auth.setCustomUserClaims(user.uid, {
    doctor: true
  });
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

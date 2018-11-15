const functions = require('firebase-functions');
const admin = require('firebase-admin');
const _ = require('lodash');

var serviceAccount = require("./serviceAccountKey");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://e-clinic-dev.firebaseio.com"
});

exports.helloWorld = functions.https.onCall((request, response) => {
  console.log(`hello, world!`);
  response.send('Hello from Firebase!');
});

exports.addDoctor = functions.https.onCall((data, context) => {

  const { email } = data;
  return grantDoctorRole(email).then(result => {
    return {
      result: `Request is fulfilled ${email} is now a doctor!`
    };
  });
});

async function grantDoctorRole(email) {
  console.log(`grantTeacherRole for ${email} user`);
  const user = await admin.auth().getUserByEmail(email);
  //custom claims check
  if (user.customClaims && _.isEmpty(user.customClaims)) {
    return;
  }
  return admin.auth().setCustomUserClaims(user.uid, {
    doctor: true
  });
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

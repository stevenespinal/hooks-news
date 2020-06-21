const functions = require('firebase-functions');

const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://hooks-news-c9337.firebaseio.com"
});

const LINKS_PER_PAGE = 5;

const db = admin.firestore()

exports.linksPagination = functions.https.onRequest((request, response) => {
  // response.send("Hello from Firebase!");
  response.set('Access-Control-Allow-Origin', '*');
  //grabs links collection from firestore db
  let linksRef = db.collection("links");
  const offsetValue = Number(request.query.offset);
  linksRef.orderBy('created', 'desc').limit(LINKS_PER_PAGE).offset(offsetValue).get().then(snapshot => {
    const links = snapshot.doc.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      }
    });
    response.json(links);
  });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

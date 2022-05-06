import * as functions from "firebase-functions";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((req, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const pullMod = functions.https.onRequest((req, res) => {
  const moduleCode = req.body.moduleCode
  console.log(moduleCode)
  res.json({moduleCode})
});

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
// # remove inactive user
// The Cloud Functions for Firebase SDK to set up triggers and logging.
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {logger} = require("firebase-functions");

// The Firebase Admin SDK to delete inactive users.
const admin = require("firebase-admin");
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();

admin.initializeApp();
// const db = getFirestore();


// Run once a day at midnight (23 on fr time), to clean up the users
// Manually run the task here https://console.cloud.google.com/cloudscheduler
// use cron scheduler: "00 */6 * * *"  => every 6h
exports.accountcleanup = onSchedule("every day 23:00", async (event) => { /** time here is on UTC+0 */
	logger.log("NGN Before trying to disconnecet inactive users");

	const inactivityDelayMinutes = 60;
	let thresholdDate = new Date();
	thresholdDate.setMinutes(thresholdDate.getMinutes() - inactivityDelayMinutes);
	let formattedThresholdDate = Timestamp.fromDate(thresholdDate);
	let query = firestore.collection('connected').where("lastActivityDate", "<", formattedThresholdDate);

	query.get().then(querySnapshot => {
	  querySnapshot.forEach(async (documentSnapshot) => {
		await documentSnapshot.ref.delete().then(() => {
			logger.log(`User ${documentSnapshot.ref.path} successfully deleted.`);
		  })
	  });
	});

	logger.log("NGN 'User cleanup finished'");
});
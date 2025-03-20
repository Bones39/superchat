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
admin.initializeApp();

// The es6-promise-pool to limit the concurrency of promises.
// const PromisePool = require("es6-promise-pool").default;
// Maximum concurrent account deletions.
const MAX_CONCURRENT = 3

// Run once a day at midnight, to clean up the users
// Manually run the task here https://console.cloud.google.com/cloudscheduler
exports.accountcleanup = onSchedule("every day 00:00", async (event) => {
	// // Fetch all user details.
	// const inactiveUsers = await getInactiveUsers();
  
	// // Use a pool so that we delete maximum `MAX_CONCURRENT` users in parallel.
	// const promisePool = new PromisePool(
	// 	() => deleteInactiveUser(inactiveUsers),
	// 	MAX_CONCURRENT,
	// );
	// await promisePool.start();

	const snapshot = await admin
	.database()
	.ref("/messages")
	.push({
		text: "------ TEST: Automatic messeage created by scheduled cloud function at midnight ------",
		createdAt: firebase.firestore.FieldValue.serverTimestamp()
	});
  
	logger.log("User cleanup finished");
  });
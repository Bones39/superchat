import { auth, firestoreDb } from '../firebaseConfig';
import { setDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, where, deleteField } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import { useSound } from 'use-sound';
import wiizSound from '../assets/MSN_WIZZ_SOUND.mp3';
import { useRef } from 'react';
import firebase from 'firebase/compat/app'
import { useFormState } from 'react-dom';

const ReadWiiz = ({readWiizProps}) => {

	// --- PROPS ---
	const {setWiizedRecepient} = readWiizProps;

	const wizzActionOnCurrentUserRef = doc(firestoreDb, "wizzActions", auth?.currentUser?.email);
	const [sender, setSender] = useState();

	let wizzCleanTimeOutId = useRef();

	/**
	 * Called to delete the wizz action about 5 sec after displaying the notification
	 * @param {string} wiizId 
	 */
	const cleanWiiz = () => {
		wizzCleanTimeOutId = setTimeout( async () => {
			// the wiizAction table is always initialized in the app.jsx component on connection
			await updateDoc(doc(firestoreDb, "wizzActions", auth?.currentUser?.email),{
				sender: deleteField()
			});
			setSender(null);
			// reset the wiiz sender so that the wiiz can be triggered again
			setWiizedRecepient(null);
		}, 5000);
	}

	useEffect(()=>{
		// put a listener on the wiizActions table to listen to wiizes that involve the current user
		const unsub = onSnapshot(wizzActionOnCurrentUserRef, (wiizSnapshot) => {
			if (wiizSnapshot.data()) {
				const currentSender = wiizSnapshot.data().sender;
				// set the sender so that the cleanWiiz function is triggerd by the rerender
				setSender(currentSender);
			}
		});
		return () => unsub();
	})

	/** Trigger a useEffect to delete the just read wiiz action */
	useEffect(() => {
		cleanWiiz();
		return () => clearTimeout(wizzCleanTimeOutId);
	},[sender])

	return (
		<>
			{sender && <div className='wizzNotification' key={`wiiz-${sender}-${auth?.currentUser?.email}`}>{`Wizzed by ${sender}`}</div>}
		</>
	)
}

export default ReadWiiz;
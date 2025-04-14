import { auth, firestoreDb } from '../firebaseConfig';

import { deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSound } from 'use-sound';
import wiizSound from '../assets/MSN_WIZZ_SOUND.mp3';
import { useRef } from 'react';
import firebase from 'firebase/compat/app'
import { useFormState } from 'react-dom';

const Wiiz = ({wiizProps}) => {
	// --- PROPS ---
	const {listOfWiizedUsers: wiizActions, displayNotif, setDisplayNotif} = wiizProps;

	const [wiiz, setWizz] = useState();

	const [play] = useSound(wiizSound, { volume: 0.08 });

	let wizzCleanTimeOutId = useRef();
	let alreadyWiiz = useRef(false);
	//
	let delaySinceWiizSentSeconde = 6;
	let thresholdDate = new Date();
	thresholdDate.setSeconds(thresholdDate.getSeconds() - delaySinceWiizSentSeconde);
	// this will define the waiting time before 2 consecutive wiiz
	let formattedThresholdDate = firebase.firestore.Timestamp.fromDate(thresholdDate);

	/**
	 * Called to delete the wizz action about 5 sec after displaying the notification
	 * @param {string} wiizId 
	 */
	const cleanWiiz = (wiizId) => {
		wizzCleanTimeOutId = setTimeout( async () => {
			await deleteDoc(doc(firestoreDb, "wizzActions", wiizId));
			alreadyWiiz.current = false;
			// setDisplayNotif(false);
		}, 4000);
	}

	useEffect(() => {
		return () => clearTimeout(wizzCleanTimeOutId);
	},[wiizActions])

	return (
		<div>
			{wiizActions?.map((wiiz) => {
				if (auth?.currentUser?.email === wiiz.recepient && !alreadyWiiz.current /*  && wiiz.date < formattedThresholdDate && displayNotif */) {
					alreadyWiiz.current = true;
					// play();
					// cleanWiiz(wiiz.id);
					return <div className='wizzNotification' key={wiiz.id}>{`Wizzed by ${wiiz.sender}`}</div>
				}
			})}
		</div>
	)
}

export default Wiiz;
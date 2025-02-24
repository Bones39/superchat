import { auth, firestoreDb } from '../firebaseConfig';

import { deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSound } from 'use-sound';
import wiizSound from '../assets/MSN_WIZZ_SOUND.mp3';
import { useRef } from 'react';
import firebase from 'firebase/compat/app'

const Wiiz = ({wiizProps}) => {
	// --- PROPS ---
	const {listOfWiizedUsers: wiizActions, displayNotif} = wiizProps;

	const [play] = useSound(wiizSound, { volume: 0.08 });

	let wizzCleanTimeOutId = useRef();
	//
	let delaySinceWiizSentSeconde = 6;
	let thresholdDate = new Date();
	thresholdDate.setSeconds(thresholdDate.getSeconds() - delaySinceWiizSentSeconde);
	// this will define the waiting time before 2 consecutive wiiz
	let formattedThresholdDate = firebase.firestore.Timestamp.fromDate(thresholdDate);

	const cleanWiiz = (wiizId) => {
		wizzCleanTimeOutId = setTimeout( async () => {
			await deleteDoc(doc(firestoreDb, "wizzActions", wiizId));
		}, 5000);
	}

	useEffect(() => {return () => clearTimeout(wizzCleanTimeOutId) },[])

	return (
		<div>
			{wiizActions?.map((wiiz) => {
				if (auth?.currentUser?.email === wiiz.recepient && wiiz.date < formattedThresholdDate && displayNotif) {
					play();
					cleanWiiz(wiiz.id);
					return <div className='wizzNotification' key={wiiz.id}>{`Wizzed by ${wiiz.sender}`}</div>
				}
			})}
		</div>
	)
}

export default Wiiz;
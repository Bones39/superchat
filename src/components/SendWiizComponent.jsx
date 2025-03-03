import { auth, firestoreDb } from '../firebaseConfig';

import { setDoc, collection, doc, updateDoc, onSnapshot, where } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import { useSound } from 'use-sound';
import wiizSound from '../assets/MSN_WIZZ_SOUND.mp3';
import { useRef } from 'react';
import firebase from 'firebase/compat/app'
import { useFormState } from 'react-dom';

const SendWiizComponent = ({sendWiizComponentProps}) => {
	// --- PROPS ---
	const {recepient} = sendWiizComponentProps;

	console.log(`recipient: ${recepient}`);

	// ---- Hooks ----
	const wizzActionRef = collection(firestoreDb, 'wizzActions');
	// const wizzActionDocRef = doc(firestoreDb, 'wizzActions', auth?.currentUser?.email);
	const wizzActionDocRef = doc(firestoreDb, 'wizzActions', recepient);    // ne fonctionne pas!!!!!!
	const [wiizActions, setWiizActions] = useState([]);

	const sendWizz = async (recepient) => {
		if(recepient) {
			await setDoc(wizzActionDocRef, {
				sender: auth?.currentUser?.email,
				// recepient: recepient,
				date: new Date() /* recepient */ /*  firebase.firestore.FieldValue.serverTimestamp() */
			});
		}
	}

	useEffect(() => {
		sendWizz(recepient);
	}, [recepient])

	/* return (
		<div>
			{wiizActions?.map((wiiz) => {
				if (auth?.currentUser?.email === wiiz.recepient) {
					return <div className='wizzNotification' key={wiiz.id}>{`Wizzed by ${wiiz.sender}`}</div>
				}
			})}
		</div>
	) */
}

export default SendWiizComponent;
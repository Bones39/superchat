import { auth, firestoreDb } from '../firebaseConfig';

import { deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSound } from 'use-sound';
import wiizSound from '../assets/MSN_WIZZ_SOUND.mp3';

const Wiiz = ({wiizProps}) => {
	const [play] = useSound(wiizSound);
	const [listOfNotificationActionsToClean, setTListOfNotificationActionsToClean] = useState([]);
	const {listOfWiizedUsers: wiizActions, displayNotif} = wiizProps;
	// console.log(`displayNotif: ${displayNotif} wiizActions: ${wiizActions}`);


	const cleanWiiz = () => {
		listOfNotificationActionsToClean.forEach(async (wiizId) => {
			await deleteDoc(doc(firestoreDb, "'wizzActions'", wiizId));
		})
	}

	const addCleanedUpObjectArray = (docId) => {
		setTListOfNotificationActionsToClean(prev => [...prev, docId]);
	}

	// useEffect(() => { return () => cleanWiiz() },[])

	return (
		<div>
			{wiizActions?.map((wiiz) => {
				if (auth?.currentUser?.email === wiiz.recepient && displayNotif) {
					play();
					// addCleanedUpObjectArray(wiiz.id);
					// setTListOfNotificationActionsToClean((prev) => prev?.push(wiiz.id));
					return <div className='wizzNotification' key={wiiz.id}>{`Wizzed by ${wiiz.sender}`}</div>
				}
			})}
		</div>
	)
}

export default Wiiz;
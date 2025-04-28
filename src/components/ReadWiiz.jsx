import { auth, firestoreDb } from '../firebaseConfig';
import { doc, onSnapshot, updateDoc, deleteField } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import { useSound } from 'use-sound';
import wiizSound from '../assets/MSN_WIZZ_SOUND.mp3';
import meowSound from '../assets/WIZZ_SOUND_MEOW_1.mp3';
import wakeUpSound from '../assets/WIZZ_SOUND_WAKEUP.mp3';
import { useRef } from 'react';

const ReadWiiz = ({readWiizProps}) => {

	// --- PROPS ---
	const {setWiizedRecepient} = readWiizProps;

	const wizzActionOnCurrentUserRef = doc(firestoreDb, "wizzActions", auth?.currentUser?.email);
	const [play] = useSound(wiizSound, { volume: 0.08 });
	const [playMeow] = useSound(meowSound, { volume: 0.95 });
	const [playWakeUp] = useSound(wakeUpSound, { volume: 0.08 });
	const [sender, setSender] = useState();

	const soundArray = [play, playMeow, playWakeUp]
	let wizzCleanTimeOutId = useRef();
	const unsub = useRef();

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
		}, 1500);
	}

	useEffect(()=>{
		// put a listener on the wiizActions table to listen to wiizes that involve the current user
		unsub.current = onSnapshot(wizzActionOnCurrentUserRef, (wiizSnapshot) => {
			if (wiizSnapshot.data()) {
				const currentSender = wiizSnapshot.data().sender;
				// set the sender so that the cleanWiiz function is triggerd by the rerender
				setSender(currentSender);
				// only play the sound if the query is triggerd, not at initialization
				let randomIndex = Math.floor(Math.random() * (soundArray.length)) || 0;
				console.log(randomIndex);
				if (currentSender) soundArray[randomIndex]();
			}
		});
		return () => unsub.current();
	})

	/** Trigger a useEffect to delete the just read wiiz action */
	useEffect(() => {
		cleanWiiz();
		unsub.current();
		return () => clearTimeout(wizzCleanTimeOutId);
	},[sender])

	return (
		<>
			{sender && <div className='wizzNotification' key={`wiiz-${sender}-${auth?.currentUser?.email}`}>{`Wizzed by ${sender}`}</div>}
		</>
	)
}

export default ReadWiiz;
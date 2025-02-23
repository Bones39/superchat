import { TiMessageTyping } from "react-icons/ti";
import { auth, firestoreDb } from '../firebaseConfig'
import { addDoc, collection, query, onSnapshot, where } from 'firebase/firestore'
import { useEffect, useState } from "react";
import firebase from 'firebase/compat/app'
import Wiiz from './Wiiz';

const Lobby = ({props}) => {
	const {connected} = props;
	const wizzActionRef = collection(firestoreDb, 'wizzActions');
	const wizzActionQuery = query(wizzActionRef);

	const [displayNotif, setDisplayNotif] = useState(false)
	const [listOfWiizedUsers, setListOfWizzedUsers] = useState([]);

	let notificationDisplayTimeSeconde = 4;
	let delaySinceWiizSentSeconde = 15;
	let thresholdDate = new Date();
	thresholdDate.setSeconds(thresholdDate.getSeconds() - delaySinceWiizSentSeconde);
	let formattedThresholdDate = firebase.firestore.Timestamp.fromDate(thresholdDate);

	const wiizProps = {
		listOfWiizedUsers,
		displayNotif
	}

	const sendWiiz = async (clickedUser) => {
		await addDoc(wizzActionRef, {
			sender: auth?.currentUser?.email,
			recepient: clickedUser,
			date: firebase.firestore.FieldValue.serverTimestamp()
		});
	}

	const hideWiizNotification = () => {
		setTimeout(() => {
			setDisplayNotif(false);
			console.log("hide!");
		}, notificationDisplayTimeSeconde*1000)
	}

	useEffect(() => {
		const un = onSnapshot(wizzActionQuery, (querySnapshot) => {
			const wiizedUsers = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
			console.log("display!");
			setListOfWizzedUsers(wiizedUsers);
			setDisplayNotif(true);
			hideWiizNotification();
		});
		return () => un();
	}, [])

	return (
		<>
			<Wiiz wiizProps={wiizProps}></Wiiz>
			<div className="lobby">
				<div className="lobbyHeader">Connecté(s)</div>
				{connected && connected.map((connectedUser) =>
					<div className="lobbyUser" key={`lobby-${connectedUser.id}`} onClick={() => sendWiiz(connectedUser.id)}>
						<div className="userTagLobby" style={{backgroundImage: `url("https://randomuser.me/api/portraits/men/${connectedUser.photoId}.jpg")`, backgroundPosition: "center", backgroundSize: "110%"}}>{connectedUser.allias}</div>
						<div>{connectedUser.email}</div>
						{connectedUser.isTyping && <i className="icon"><TiMessageTyping/></i>}
					</div>
				)}
			</div>
		</>
	)
}

export default Lobby;
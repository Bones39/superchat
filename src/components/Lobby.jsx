import { TiMessageTyping } from "react-icons/ti";
import { auth, firestoreDb } from '../firebaseConfig'
import { addDoc, collection, query, onSnapshot, where } from 'firebase/firestore'
import { useEffect, useState } from "react";
import firebase from 'firebase/compat/app'
import Wiiz from './Wiiz';
import SendWiizComponent from './SendWiizComponent';
import ReadWiiz from "./ReadWiiz";

const Lobby = ({props}) => {
	const {connected} = props;
	const wizzActionRef = collection(firestoreDb, 'wizzActions');
	const wizzActionQuery = query(wizzActionRef);

	const [displayNotif, setDisplayNotif] = useState()
	const [listOfWiizedUsers, setListOfWizzedUsers] = useState([]);
	const [wiizedRecepient, setWiizedRecepient] = useState("");

	let notificationDisplayTimeSeconde = 5;

	const wiizProps = {
		listOfWiizedUsers,
		displayNotif,
		setDisplayNotif
	}

	const sendWiizComponentProps = {
		recepient: wiizedRecepient
	}

	const readWiizProps = {
		setWiizedRecepient
	}

	const sendWiiz = async (clickedUser) => {
		await addDoc(wizzActionRef, {
			sender: auth?.currentUser?.email,
			recepient: clickedUser,
			date: firebase.firestore.FieldValue.serverTimestamp()
		});
	}

	const deleteWiiz = () => {
		setTimeout(async () => {
			await deleteDoc(doc(firestoreDb, "wizzActions", wiizId));
		}, notificationDisplayTimeSeconde*1000)
	}

	useEffect(() => {
		const un = onSnapshot(wizzActionQuery, (querySnapshot) => {
			const wiizedUsers = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
			setListOfWizzedUsers(wiizedUsers);
			setDisplayNotif(true);
			// console.log(`display! ${JSON.stringify(listOfWiizedUsers)}`);
			// hideWiizNotification();
		});
		return () => un();
	}, [])

	return (
		<>
			{/* <Wiiz wiizProps={wiizProps}></Wiiz> */}
			{wiizedRecepient && <SendWiizComponent sendWiizComponentProps={sendWiizComponentProps}></SendWiizComponent>}
			<ReadWiiz readWiizProps={readWiizProps}></ReadWiiz>
			<div className="lobby">
				<div className="lobbyHeader">Connecté(s)</div>
				{connected && connected.map((connectedUser) =>
					<div className="lobbyUser" key={`lobby-${connectedUser.id}`} onClick={() => {setWiizedRecepient(connectedUser.id)}}>
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
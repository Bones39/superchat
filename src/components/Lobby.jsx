import { TiMessageTyping } from "react-icons/ti";
import { FaBell } from "react-icons/fa";
import { auth, firestoreDb } from '../firebaseConfig'
import { addDoc, collection, query, onSnapshot, where } from 'firebase/firestore'
import { useEffect, useRef, useState } from "react";
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

	const [isBellActive, setIsBellActive] = useState(false);
	let intervalId = useRef(null);

	let notificationDisplayTimeSeconde = 5;
	const bellActiveDurationMs = 1500;
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

	const handleBellClick = (userToWizz) => {
		// send the wizz notification
		setWiizedRecepient(userToWizz);
		// handle classname to trigger the bell animation
		if (!!userToWizz.id) return
		// prevent the user to wiz himself
		clearInterval(intervalId.current);
		setIsBellActive(true);
		intervalId.current = setInterval(() => {
			setIsBellActive(false);
		}, bellActiveDurationMs);
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
		return () => {
			un();
			clearInterval(intervalId.current);
		}
	}, [])

	return (
		<>
			{/* <Wiiz wiizProps={wiizProps}></Wiiz> */}
			{wiizedRecepient && <SendWiizComponent sendWiizComponentProps={sendWiizComponentProps}></SendWiizComponent>}
			<ReadWiiz readWiizProps={readWiizProps}></ReadWiiz>
			<div className="lobby">
				<div className="lobbyHeader">Utilisateurs connectés</div>
				{connected && connected.map((connectedUser) =>
					connectedUser.id !== auth?.currentUser?.email &&
						<div className="lobbyUser" key={`lobby-${connectedUser.id}`}>
							<div className="userTagLobby" style={{backgroundImage: `url(${connectedUser.catAvatarImageUrl ? connectedUser.catAvatarImageUrl : `"https://randomuser.me/api/portraits/men/${connectedUser.photoId}.jpg"`})`, backgroundPosition: "center", backgroundSize: "110%"}}>
								{connectedUser.isTyping &&
								/* Typing icon in svg */
									<svg id="svgTypingIcon" width="112" height="107" viewBox="0 0 112 107" fill="none" xmlns="http://www.w3.org/2000/svg">
										<circle cx="58.5" cy="53.5" r="50.5" stroke="#ffde59" strokeWidth="6"/>
										<circle cx="34" cy="52" r="6" fill="#ffde59"/>
										<circle cx="59" cy="52" r="6" fill="#ffde59"/>
										<circle cx="84" cy="52" r="6" fill="#ffde59"/>
										<path d="M8.21755 98.1799L14.2181 78.2804L28.4514 93.4268L8.21755 98.1799Z" fill="#ffde59"/>
									</svg>
								}
							</div>
							<div className="userName">{connectedUser.userName}</div>
							<div className="wizzButton" onClick={() => {handleBellClick(connectedUser.id)}}><FaBell id="bellIcon" size="1.4em" className={isBellActive && connectedUser.id === wiizedRecepient ? "activeBellIcon" : ""}/></div>
						</div>
				)}
			</div>
		</>
	)
}

export default Lobby;
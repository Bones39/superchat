import { TiMessageTyping } from "react-icons/ti";
import { FaBell } from "react-icons/fa";
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
				<div className="lobbyHeader">Utilisateurs connectés</div>
				{connected && connected.map((connectedUser) =>
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
							{/* {connectedUser.isTyping && <img className="typingIcon" src='src\assets\TypingIconSvg.svg'/>} */}
							{/* {connectedUser.isTyping && <img className="typingIcon" src='src\assets\TypingIcon.png'/>} */}
							{/* {connectedUser.isTyping && <i className="typingIcon"><TiMessageTyping/></i>} */}
						</div>
						<div className="userName">{connectedUser.userName}</div>
						<div className="wizzButton" onClick={() => {setWiizedRecepient(connectedUser.id)}}><FaBell id="bellIcon" size="1.4em"/></div>
					</div>
				)}
			</div>
		</>
	)
}

export default Lobby;
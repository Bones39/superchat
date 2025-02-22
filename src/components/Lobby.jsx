import { TiMessageTyping } from "react-icons/ti";
import { auth, firestoreDb } from '../firebaseConfig'
import { addDoc, collection, query, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from "react";

const Lobby = ({props}) => {
	const {connected} = props;
	const wizzActionRef = collection(firestoreDb, 'wizzActions');
	const wizzActionQuery = query(wizzActionRef);

	const [listOfWiizedUsers, setListOfWizzedUsers] = useState([]);

	const wiiz = async (clickedUser) => {
		await addDoc(wizzActionRef, {
			sender: auth?.currentUser?.email,
			recepient: clickedUser
		});
	}

	useEffect(() => {
		const un = onSnapshot(wizzActionQuery, (querySnapshot) => {
			const wiizedUsers = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
			setListOfWizzedUsers(wiizedUsers);
		});
	}, [])

	return (
		<>
			{listOfWiizedUsers.map((wiiz) => {
				if (auth?.currentUser?.email === wiiz.recepient) return <div className='wizzNotification'>{`Wizzed by ${wiiz.sender}`}</div>
			})}
			<div className="lobby">
				<div className="lobbyHeader">Connecté(s)</div>
				{connected && connected.map((connectedUser) =>
					<div className="lobbyUser" key={`lobby-${connectedUser.id}`} onClick={() => wiiz(connectedUser.id)}>
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
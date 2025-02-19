import { TiMessageTyping } from "react-icons/ti";
import { auth } from '../firebaseConfig'

const Lobby = ({props}) => {
	const {connected, setWizzedUser} = props;

	const wiiz = (clickedUser) => {
		setWizzedUser(clickedUser);
	}

	return (
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
	)
}

export default Lobby;
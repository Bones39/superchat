import { TiMessageTyping } from "react-icons/ti";

const Lobby = ({props}) => {
	const {connected} = props;
	return (
		<div className="lobby">
			{connected && connected.map((connectedUser) =>
				<div className="lobbyUser" key={`lobby-${connectedUser.id}`}>
					<div className="userTagLobby" style={{backgroundImage: `url("https://randomuser.me/api/portraits/men/${connectedUser.photoId}.jpg")`}}>{connectedUser.allias}</div>
					<div>{connectedUser.email}</div>
					<i className="icon"><TiMessageTyping/></i>
				</div>
			)}
		</div>
	)
}

export default Lobby;
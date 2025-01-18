const Lobby = ({props}) => {
	const {connected} = props;
	return (
		<div className="lobby">
			{connected && connected.map((connectedUser) =>
				<div className="lobbyUser">
					<div className="userTagLobby" style={{backgroundImage: `url("https://randomuser.me/api/portraits/men/${connectedUser.photoId}.jpg")`}}>{connectedUser.allias}</div>
					<div key={`lobby-${connectedUser.id}`}>{connectedUser.email}</div>
				</div>
			)}
		</div>
	)
}

export default Lobby;
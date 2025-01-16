const Lobby = ({props}) => {
	const {connected} = props;
	return (
		<div className="lobby">
			{connected && connected.map((connectedUser) => <div key={`lobby-${connectedUser.id}`}>{connectedUser.email}</div>)}
		</div>
	)
}

export default Lobby;
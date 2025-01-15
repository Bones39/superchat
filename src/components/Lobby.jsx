const Lobby = ({connected}) => {
	console.log(`from the lobby connected: ${connected}`);
	return (
		<div className="lobby">
			{connected && connected.map((connectedUser) => <div>Test</div>)}
		</div>
	)
}

export default Lobby;
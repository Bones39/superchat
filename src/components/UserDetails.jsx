
import { auth } from './firebaseConfig'

const UserDetails = () => {
	return (
		<div>
			<div className="userTagLobby" style={{backgroundImage: `url("https://randomuser.me/api/portraits/men/${connectedUser.photoId}.jpg")`, backgroundPosition: "center", backgroundSize: "110%"}}></div>
			<div className="userName">{auth?.currentUser?.email}</div>
		</div>
	)
}
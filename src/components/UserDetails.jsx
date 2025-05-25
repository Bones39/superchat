
import { auth } from '../firebaseConfig'

const UserDetails = ({headerProps}) => {
	const {currentUser} = headerProps;
	return (
		<div className='userDetails'>
			<div className="userDetailHeader" style={{backgroundImage: `url(${currentUser?.catAvatarImageUrl ? currentUser?.catAvatarImageUrl : `"https://randomuser.me/api/portraits/men/${currentUser?.photoId}.jpg"`})`, backgroundPosition: "center", backgroundSize: "110%"}}></div>
			<div className="userNameHeader">{currentUser?.userName}</div>
		</div>
	)
}

export default UserDetails;
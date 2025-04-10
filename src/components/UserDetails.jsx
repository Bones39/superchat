
import { auth } from '../firebaseConfig'

const UserDetails = ({headerProps}) => {
	const {currentUser} = headerProps;
	return (
		<div className='userDetails'>
			<div className="userDetailHeader" style={{backgroundImage: `url("https://randomuser.me/api/portraits/men/${currentUser?.photoId}.jpg")`, backgroundPosition: "center", backgroundSize: "110%"}}></div>
			<div className="userNameHeader">{auth?.currentUser?.email}</div>
		</div>
	)
}

export default UserDetails;
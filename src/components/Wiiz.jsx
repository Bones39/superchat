import { auth } from '../firebaseConfig'

const Wiiz = ({wiizProps}) => {

	const {listOfWiizedUsers: wiizActions, displayNotif} = wiizProps;
	console.log(`displayNotif: ${displayNotif} wiizActions: ${wiizActions}`);

	return (
		<div>
			{wiizActions?.map((wiiz) => {
				if (auth?.currentUser?.email === wiiz.recepient && displayNotif) return <div className='wizzNotification' key={wiiz.id}>{`Wizzed by ${wiiz.sender}`}</div>
			})}
		</div>
	)
}

export default Wiiz;
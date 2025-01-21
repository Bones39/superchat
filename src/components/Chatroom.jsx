import { useEffect } from 'react';
import { auth } from '../firebaseConfig'
import firebase from 'firebase/compat/app'

const Chatroom = ({props}) => {
	const {messages, formValue, sendMessage, setFormValue, dummy} = props;

	useEffect(() => {
		// scroll to the end of the page when the user connects
		dummy?.current?.scrollIntoView();
	})

	return(
		<>
			<div className="chatroom">
				{/* // chat room */}
				{messages && messages.map((message, index) =>
					{
						if(!message || !auth.currentUser) return(<></>);
						let bDisplayUserPicture = (index !== 0 && messages[index-1].uid !== message.uid && message.uid !== auth.currentUser.uid)
							|| (index === 0 && message.uid !== auth.currentUser.uid);
						const date = new Date((message.createdAt?.seconds ? message.createdAt.seconds : firebase.firestore.FieldValue.serverTimestamp()) * 1000);
						const formatedDate = `${date.toLocaleString()}`
						// display the picture above the message if the first message is not from the current user or if a message comes after a message which is not his
						if (bDisplayUserPicture) {
							return (
								<div className={message.uid === auth.currentUser.uid ? "right " : "left"} key={message.id + 'frag'}>
									<div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} userTag`} key={message.id + 'tag'} style={{backgroundImage: `url("https://randomuser.me/api/portraits/men/${message.photoId}.jpg")`}}>{message.allias}</div>
									<div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id}>{message.text}</div>
									<div className='timeStamp'key={message.id + "timeStamp"}>{formatedDate}</div>
									{/* <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} timeStamp`} key={message.id + "timeStamp"}>{formatedDate}</div> */}
								</div>
							)
						} else {
							return (
								<div className={message.uid === auth.currentUser.uid ? "right " : "left"} key={message.id + 'frag'}>
									<div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id}>{message.text}</div>
									<div className='timeStamp' key={message.id + "timeStamp"}>{formatedDate}</div>
									{/* <div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id + "timeStamp"}>{message.createdAt}</div> */}
								</div>
							)
						}
					}
				)}
				<div ref={dummy}></div>
			</div>
			{/** display the form*/}
			<form className='messageInput' onSubmit={sendMessage}>
				<input type="text" value={formValue} onChange={(e)=>setFormValue(e.target.value)}/>
				<button type='submit'>SEND</button>
			</form>
		</>
	)
}

export default Chatroom;
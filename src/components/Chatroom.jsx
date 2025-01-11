import { auth } from '../firebaseConfig'

const Chatroom = ({props}) => {
	const {messages, formValue, sendMessage, setFormValue, dummy} = props;

	return(
		<>
			<div className="chatroom">
				{/* // chat room */}
				{messages && messages.map((message, index) =>
					{
						let bDisplayUserPicture = (index !== 0 && messages[index-1].uid !== message.uid && message.uid !== auth.currentUser.uid)
							|| (index === 0 && message.uid !== auth.currentUser.uid);
						// display the picture above the message if the first message is not from the current user or if a message comes after a message which is not his
						console.log(bDisplayUserPicture);
						if (bDisplayUserPicture) {
							return (
								<>
									<div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} userTag`} key={message.id + 'tag'} style={{backgroundImage: `url("https://randomuser.me/api/portraits/men/${message.photoId}.jpg")`}}>{message.allias}</div>
									<div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id}>{message.text}</div>
									{/* <div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id + "timeStamp"}>{message.createdAt}</div> */}
								</>
							)
						} else {
							return (
								<>
									<div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id}>{message.text}</div>
									{/* <div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id + "timeStamp"}>{message.createdAt}</div> */}
								</>
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
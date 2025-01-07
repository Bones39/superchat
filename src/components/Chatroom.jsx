import { auth } from '../firebaseConfig'

const Chatroom = ({messages, formValue, sendMessage, setFormValue, dummyRef}) => {
	return(
		<>
			<div className="chatroom">
				{/* // chat room */}
				{messages && messages.map((message, index) =>
					index !== 0 && messages[index-1].uid !== message.uid && message.uid !== auth.currentUser.uid?
					// add a div containing the user if the message is a new message -> put this in a new component!!
						<div key={message.id + 'div'}>
							<div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} userTag`} key={message.id + 'tag'} style={{backgroundImage: `url("https://randomuser.me/api/portraits/men/${message.photoId}.jpg")`}}>{message.allias}</div>
							<div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id}>{message.text}</div>
						</div>
					:
					index === 0 && message.uid !== auth.currentUser.uid?
						<div key={message.id + 'div2'}>
							<div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} userTag`}>{message.allias}</div>
							<div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id}>{message.text}</div>
						</div>
					:
					<div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id}>{message.text}</div>
				)}
				<div ref={dummyRef}></div>
			</div>
			<form className='messageInput' onSubmit={sendMessage}>
				<input type="text" value={formValue} onChange={(e)=>setFormValue(e.target.value)}/>
				<button type='submit'>SEND</button>
			</form>
		</>
	)
}

export default Chatroom;
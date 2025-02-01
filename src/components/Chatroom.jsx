import { useEffect } from 'react';
import { auth } from '../firebaseConfig'
import firebase from 'firebase/compat/app'
import { CiImageOn } from "react-icons/ci";

const Chatroom = ({props}) => {
	const {messages, formValue, sendMessage, sendImage, typing, dummy} = props;

	useEffect(() => {
		// scroll to the end of the page when the user connects
		dummy?.current?.scrollIntoView();
	})

	const loadFile = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();

		reader.addEventListener("load", () => {
			console.log(reader.result)
		})

		reader.readAsDataURL(file);
	}

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
									<div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} userTag`} key={message.id + 'tag'} style={{backgroundImage: `url("https://randomuser.me/api/portraits/men/${message.photoId}.jpg")`, backgroundPosition: "center", backgroundSize: "110%"}}>{message.allias}</div>
									{!message.type && <div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id}>{message.text}</div>}
									{(message.type && message.type ==="image") && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} image`} key={message.id}><img src={message.text} alt="Base64 Image" /></div>}
									<div className='timeStamp'key={message.id + "timeStamp"}>{formatedDate}</div>
									{/* <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} timeStamp`} key={message.id + "timeStamp"}>{formatedDate}</div> */}
								</div>
							)
						} else {
							return (
								<div className={message.uid === auth.currentUser.uid ? "right " : "left"} key={message.id + 'frag'}>
									{!message.type && <div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id}>{message.text}</div>}
									{(message.type && message.type ==="image") && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} image`} key={message.id}><img src={message.text} alt="Base64 Image" /></div>}
									<div className={`timeStamp ${message.uid === auth.currentUser.uid ? "alignRight " : ""}`} key={message.id + "timeStamp"}>{formatedDate}</div>
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
				<input className='textInput' type="text" value={formValue} onChange={(e)=>typing(e)}/>
				<button type='submit'>SEND</button>
				<label className='customFileUpload'>
					<CiImageOn/>
					<input className='fileInput' type='file' onChange={(e)=>sendImage(e)}/>
				</label>
			</form>
		</>
	)
}

export default Chatroom;
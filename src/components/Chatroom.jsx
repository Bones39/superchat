import { useEffect, useRef, useState } from 'react';
import { auth } from '../firebaseConfig'
import firebase from 'firebase/compat/app'
import { CiImageOn } from "react-icons/ci";
import { confirmPasswordReset } from 'firebase/auth';

const Chatroom = ({props}) => {
	const {messages, formValue, sendMessage, sendImage, typing, dummy} = props;
	// const [ref, hovering] = useHover();
  	// const [hoverTime, setHoverTime] = useState(0);
	// const [hovered, setHovered] = useState(false); // use a ref to avoid rerender
	const timeoutId = useRef(null);
	const controllerRef = useRef();

	useEffect(() => {
		const controller = controllerRef.current;
		const { signal } = controller;
		// scroll to the end of the page when the user connects
		dummy?.current?.scrollIntoView();

		signal.addEventListener("abort", (event) => {
			console.log("aborted: " + event.target.reason)
			clearTimeout(timeoutId);
		})
	})

/* 	const loadFile = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();

		reader.addEventListener("load", () => {
			console.log(reader.result)
		})

		reader.readAsDataURL(file);
	} */

	//Source for the abort controller concept: https://www.youtube.com/shorts/VEdiHbjgIK4

	const onHover = () => {
		controllerRef.current = new AbortController();
		const timeoutId = setTimeout(() => {
			// setHoverTime((prevTime) => prevTime + 1);
			if (controllerRef.current && !controllerRef.current.aborted) {
				console.log("timed out!");
			}
		}, 2000); // Increment the hover time every second
	
		return () => {
			clearTimeout(timeoutId);
		};
	}

	const onLeave = () => {
		if (controllerRef.current && !controllerRef.current.aborted) {
			controllerRef.current.abort("leaved the element");
			clearTimeout(timeoutId);
		}
		console.log("Leaved!");
		// setHovered(false);
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
									{!message.type && <div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id} onMouseEnter={onHover} onMouseLeave={onLeave}>{message.text}</div>}
									<div>TEST</div>
									{/* {(message.type && message.type ==="image") && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} image`} key={message.id}><img src={message.text} alt="Base64 Image" /></div>} */}
									{(message.type && message.type ==="image") && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} image`} key={message.id}><img className="displayedImage" src={message.text} alt="Base64 Image" /></div>}
									<div className='timeStamp'key={message.id + "timeStamp"}>{formatedDate}</div>
									{/* <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} timeStamp`} key={message.id + "timeStamp"}>{formatedDate}</div> */}
								</div>
							)
						} else {
							return (
								<div className={message.uid === auth.currentUser.uid ? "right " : "left"} key={message.id + 'frag'}>
									{!message.type && <div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id} onMouseEnter={onHover} onMouseLeave={onLeave}>{message.text}</div>}
									{/* {(message.type && message.type ==="image") && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} image`} key={message.id}><img src={message.text} alt="Base64 Image" /></div>} */}
									{(message.type && message.type ==="image") && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} image`} key={message.id}><img className="displayedImage" src={message.text} alt="Base64 Image" /></div>}
									<div>TEST</div>
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
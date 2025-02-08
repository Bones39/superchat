import { useEffect, useRef, useState } from 'react';
import { auth } from '../firebaseConfig'
import firebase from 'firebase/compat/app'
import { CiImageOn } from "react-icons/ci";
import Message from "./Message"
import { confirmPasswordReset } from 'firebase/auth';
import { FaLess } from 'react-icons/fa';

const Chatroom = ({props}) => {
	const {messages, formValue, sendMessage, sendImage, typing} = props;
	const timeoutId = useRef();
	const controllerRef = useRef();
	const dummyRef = useRef();
	const [abortController, setAbortController] = useState(new AbortController());

	useEffect(() => {
		// scroll to the end of the page when the user connects
		dummyRef?.current?.scrollIntoView();
	}, [messages])

	useEffect(() => {
		/* const controller = new AbortController();
		controllerRef.current = controller; */
		const { signal } = abortController;

		signal.addEventListener("abort", (event) => {
			console.log("aborted: " + event.target.reason)
			clearTimeout(timeoutId);
		})
	}, [abortController])

	//Source for the abort controller concept: https://www.youtube.com/shorts/VEdiHbjgIK4

	const onHover = () => {

		console.log("hoverd!");
		const timeoutId = setTimeout(() => {
			if (abortController && !abortController.signal.aborted) {
				abortController.abort("time out completed");
				setVisible(true);
			}
			setAbortController(new AbortController());
		}, 800); // Increment the hover time every second
	}

	const onLeave = () => {
		console.log("leaved");
		if (abortController && !abortController.signal.aborted) {
			abortController.abort("leaved the element");
			setAbortController(new AbortController());
			setVisible(false);
		}
	}

	return(
		<>
			<div className="chatroom">
				{/* // chat room */}
				{messages && messages.map((message, index) =>
					{
						// if(!message || !auth.currentUser) return(<></>);
						// let bDisplayUserPicture = (index !== 0 && messages[index-1].uid !== message.uid && message.uid !== auth.currentUser.uid)
						// 	|| (index === 0 && message.uid !== auth.currentUser.uid);
						// const date = new Date((message.createdAt?.seconds ? message.createdAt.seconds : firebase.firestore.FieldValue.serverTimestamp()) * 1000);
						// const formatedDate = `${date.toLocaleString()}`
						// // display the picture above the message if the first message is not from the current user or if a message comes after a message which is not his
						// return (
						// 	<div className={message.uid === auth.currentUser.uid ? "right " : "left"} key={message.id + 'frag'}>
						// 		{bDisplayUserPicture && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} userTag`} key={message.id + 'tag'} style={{backgroundImage: `url("https://randomuser.me/api/portraits/men/${message.photoId}.jpg")`, backgroundPosition: "center", backgroundSize: "110%"}}>{message.allias}</div>}
						// 		{!message.type && <div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id} onMouseEnter={onHover} onMouseLeave={onLeave}>{message.text}</div>}
						// 		<div className={visible? "visible" : "hidden"}>TEST</div>
						// 		{/* {(message.type && message.type ==="image") && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} image`} key={message.id}><img src={message.text} alt="Base64 Image" /></div>} */}
						// 		{(message.type && message.type ==="image") && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} image`} key={message.id}><img className="displayedImage" src={message.text} alt="Base64 Image" /></div>}
						// 		{/* <div className='timeStamp'key={message.id + "timeStamp"}>{formatedDate}</div> */}
						// 		<div className={`timeStamp ${message.uid === auth.currentUser.uid ? "alignRight " : ""}`} key={message.id + "timeStamp"}>{formatedDate}</div>
						// 		{/* <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} timeStamp`} key={message.id + "timeStamp"}>{formatedDate}</div> */}
						// 	</div>
						// )
						return <Message props={{messages, message, index}} key={message.id}></Message>
					}
				)}
				<div ref={dummyRef}></div>
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
import { useEffect, useRef, useState } from 'react';
import { auth } from '../firebaseConfig'
import Reactions from './Reactions';

const Message = ({props}) => {
	const {messages, message, index} = props;
	const [abortController, setAbortController] = useState(new AbortController());
	const [messageHovered, setMessageHovered] = useState(false);
	const [selectingReaction, setSelectingReaction] = useState(false)

	let timeoutId = useRef();
	let fadingTimeoutId = useRef();

	useEffect(() => {
		const { signal } = abortController;

		signal.addEventListener("abort", (event) => {
			console.log("aborted: " + event.target.reason)
			clearTimeout(timeoutId);
		})
		clearTimeout(fadingTimeoutId);

		// return (() => {clearTimeout(fadingTimeoutId)})
	}, [abortController])
	
	//Source for the abort controller concept: https://www.youtube.com/shorts/VEdiHbjgIK4

	const onHover = () => {
		clearTimeout(fadingTimeoutId);
		timeoutId = setTimeout(() => {
			setMessageHovered(true);
			if (abortController && !abortController.signal.aborted) {
				abortController.abort("time out completed");
				setMessageHovered(true);
			}
			setAbortController(new AbortController());
		}, 500);
	}

	const onLeave = () => {
		if (!selectingReaction) {
			fadingTimeoutId = setTimeout(() => {
				// the visibility of the reactions is also manage on the Reaction child component
				setMessageHovered(false);
			}, 1000);
		}
		if (abortController && !abortController.signal.aborted) {
			abortController.abort("leaved the element");
			setAbortController(new AbortController());
		}
	}

	let bDisplayUserPicture = (index !== 0 && messages[index-1].uid !== message.uid && message.uid !== auth.currentUser.uid)
		|| (index === 0 && message.uid !== auth.currentUser.uid);
	const date = new Date((message.createdAt?.seconds ? message.createdAt.seconds : firebase.firestore.FieldValue.serverTimestamp()) * 1000);
	const formatedDate = `${date.toLocaleString()}`
	
	if (!message || !auth.currentUser) return(<></>);

	return (
		<div className={message.uid === auth.currentUser.uid ? "right " : "left"} key={message.id + 'frag'}>
			{/* display the picture above the message if the first message is not from the current user or if a message comes after a message which is not his */}
			{bDisplayUserPicture && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} userTag`} key={message.id + 'tag'} style={{backgroundImage: `url("https://randomuser.me/api/portraits/men/${message.photoId}.jpg")`, backgroundPosition: "center", backgroundSize: "110%"}}>{message.allias}</div>}
			{!message.type && <div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id} onMouseEnter={onHover} onMouseLeave={onLeave}>{message.text}</div>}
			{(message.type && message.type ==="image") && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} image`} key={message.id} onMouseEnter={onHover} onMouseLeave={onLeave}><img className="displayedImage" src={message.text} alt="Base64 Image" /></div>}
			<div className={`${message.uid === auth.currentUser.uid ? "right " : "left"}`}><Reactions props={{messageHovered, selectingReaction, setSelectingReaction}}/></div>
			{/* <div className={`${visible? "visible" : "hidden"} ${message.uid === auth.currentUser.uid ? "right " : "left"}`}>{'😄 😥 🤬'}</div> */}
			<div className={`timeStamp ${message.uid === auth.currentUser.uid ? "alignRight " : ""}`} key={message.id + "timeStamp"}>{formatedDate}</div>
		</div>
	)
}
export default Message;
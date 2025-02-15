import { collection, doc,getDocs, setDoc, query, where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { auth, firestoreDb } from '../firebaseConfig';
import Reactions from './Reactions';

const Message = ({props}) => {
	const {messages, message, index} = props;
	const [abortController, setAbortController] = useState(new AbortController());
	const [messageHovered, setMessageHovered] = useState(false);
	const [displayReaction, setDisplayReaction] = useState(false);
	const [selectingReaction, setSelectingReaction] = useState(false);   // true when the reaction array is hovered
	const [selectedReaction, setSelectedReaction] = useState();

	// get the messages collection
	const messagesRef = collection(firestoreDb, 'messages');
	const messageQuery = query(messagesRef, where("id", "==", message.id));

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
		console.log("hovered!")
		setMessageHovered(true);
	}
			
	const onMessageClick = () => {
		// toggle visibility of the reactions array
		setDisplayReaction(previousState => !previousState);
		console.log(`display reaction: ${displayReaction}`);
	}
			
	const onLeave = () => {
		setMessageHovered(false);
		if (!selectingReaction) {
			fadingTimeoutId = setTimeout(() => {
				// the visibility of the reactions is also manage on the Reaction child component
				// setMessageHovered(false);
				setDisplayReaction(false);
			}, 1000);
		}
		if (abortController && !abortController.signal.aborted) {
			abortController.abort("leaved the element");
			setAbortController(new AbortController());
		}
	}

	// save the reaction in the database
	const saveReaction = async (smiley) => {
		const querySnapshot = await getDocs(messageQuery);
		querySnapshot.forEach(async (doc) => {
		// doc.data() is never undefined for query doc snapshots
			// console.log(doc.id, " => ", doc.data());
			// if displayed smiley has been clicked, delete it
			if (doc.data().reaction && doc.data().reaction === smiley) {
				await setDoc(doc(firestoreDb, "messages", message.id), {
					reaction: ""
				},
				{merge: true})
			} else {
				await setDoc(doc(firestoreDb, "messages", message.id), {
					reaction: smiley
				},
				{merge: true})
				setSelectedReaction(smiley);
			}
		});
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
			{!message.type && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} message`} key={message.id} onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onMessageClick}>{message.text}</div>}
			{(message.type && message.type ==="image") && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} image message`} key={message.id} onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onMessageClick}><img className="displayedImage" src={message.text} alt="Base64 Image"/></div>}
			<div className={`${message.uid === auth.currentUser.uid ? "right " : "left"}`}><Reactions props={{displayReaction, selectingReaction, setSelectingReaction, selectedReaction, saveReaction}}/></div>
			<div className={`timeStamp ${message.uid === auth.currentUser.uid ? "alignRight " : ""}`} key={message.id + "timeStamp"}>{formatedDate}</div>
		</div>
	)
}
export default Message;
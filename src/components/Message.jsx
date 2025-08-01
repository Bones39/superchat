import { collection, doc, getDocs, setDoc, query, where, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useEffect, useRef, useState, useMemo } from 'react';
import { auth, firestoreDb } from '../firebaseConfig';
import Reactions from './Reactions';
import firebase from 'firebase/compat/app'
import { useInView } from 'react-intersection-observer';
import Linkify from './Linkify';

const Message = ({props}) => {
	const {messages, message, index, setScrollIntoView, messagesReferencesArray, setDisplayPreviousButton} = props;
	const [abortController, setAbortController] = useState(new AbortController());
	const [messageHovered, setMessageHovered] = useState(false);
	const [displayReaction, setDisplayReaction] = useState(false);
	const [selectingReaction, setSelectingReaction] = useState(false);   // true when the reaction array is hovered
	const [selectedReaction, setSelectedReaction] = useState();
	const {refView, inView} = useInView();
	const [isIntersecting, setIsIntersecting] = useState(false);
	const observer = useMemo(
		() => new IntersectionObserver(([entry]) => {setIsIntersecting(entry.isIntersecting), setDisplayPreviousButton(entry.isIntersecting)}),
		[]
	);

	// get the messages collection
	const messagesRef = collection(firestoreDb, 'messages');
	const messageQuery = query(messagesRef, where("id", "==", message.id));
	const indexOfIntersectedMessage = 0;

	// let timeoutId = useRef();
	let fadingTimeoutId = useRef();

	// UseEffect 
	useEffect(() => {
		if (messagesReferencesArray.current[indexOfIntersectedMessage]) {
		  observer.observe(messagesReferencesArray.current[indexOfIntersectedMessage]);
		  return () => {
			observer.disconnect();
		  };
		}
	  }, [messagesReferencesArray.current[indexOfIntersectedMessage], observer]);

	useEffect(() => {
		const { signal } = abortController;

		signal.addEventListener("abort", (event) => {
			clearTimeout(fadingTimeoutId);
		})
		clearTimeout(fadingTimeoutId);

		// return (() => {clearTimeout(fadingTimeoutId)})
	}, [abortController])

	useEffect(() => {
		console.log(inView);
	}, [inView])
	
	//Source for the abort controller concept: https://www.youtube.com/shorts/VEdiHbjgIK4

	const onHover = () => {
		abortController.abort("entered the element");
		clearTimeout(fadingTimeoutId);
		setMessageHovered(true);
		setAbortController(new AbortController())
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
				console.log("time out completed!")
			}, 1000);
		}
		if (abortController && !abortController.signal.aborted) {
			abortController.abort("leaved the element");
			setAbortController(new AbortController());
		}
	}

	// save the reaction in the database
	const saveReaction = async (smiley) => {
		// const querySnapshot = await getDocs(messageQuery);
		setScrollIntoView(false);
		const messageDocRef = doc(firestoreDb, "messages", message.id);
		await setDoc(messageDocRef, {
				reactions: arrayUnion(`${smiley},${auth.currentUser.uid}`)
			},
			{merge: true}
		)
	}

	// remove the reaction from the database
	const removeReaction = async (message, clickedSmiley) => {
		// const querySnapshot = await getDocs(messageQuery);
		/* const messageDocRef = doc(firestoreDb, "messages", message.id);
		await setDoc(messageDocRef, {
				reactions: arrayUnion(`${smiley},${auth.currentUser.uid}`)
			},
			{merge: true}
		) */
	// carefull, it is not really a smiley, it is an array
		let updatedReactionsArray = message.reactions.filter((smiley) => clickedSmiley !== smiley);
		const messageDocRef = doc(firestoreDb, "messages", message.id);
		await updateDoc(messageDocRef, {
			reactions: updatedReactionsArray
		});
	}

	let bDisplayUserPicture = (index !== 0 && messages[index-1].uid !== message.uid && message.uid !== auth.currentUser.uid)
		|| (message && index === 0 && message.uid !== auth.currentUser.uid);
	const date = new Date((message.createdAt?.seconds ? message.createdAt.seconds : firebase.firestore.FieldValue.serverTimestamp()) * 1000);
	const options = {
		weekday: 'short', month: 'short', day: "numeric", hour: 'numeric', minute: "2-digit"
	}
	const formatedDate = `${date.toLocaleString("fr-FR", options)}`
	
	if (!message || !auth.currentUser) return(<></>);

	// if (index === 0 ) console.log(`message ${JSON.stringify(message)}`);

	return (
		<div ref={ref => messagesReferencesArray.current[index] = ref} className={message.uid === auth.currentUser.uid ? "right " : "left"} key={message.id + 'frag'}>
			{/* display the picture above the message if the first message is not from the current user or if a message comes after a message which is not his */}
			{bDisplayUserPicture && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} userTag`} key={message.id + 'tag'} style={{backgroundImage: `url("${message.catAvatarImageUrl ? message.catAvatarImageUrl : `https://randomuser.me/api/portraits/men/${message.photoId}.jpg`}")`, backgroundPosition: "center", backgroundSize: "110%"}}>{message.allias}</div>}
			{/* display the message text or the link or the image*/}
			{!message.type && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} message`} key={message.id} onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onMessageClick}><Linkify originalText = {message.text}/></div>}
			{(message.type && message.type ==="image") && <div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} image message`} key={message.id} onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onMessageClick}><img className="displayedImage" src={message.text} alt="Base64 Image"/></div>}
			{/* display selected reactions */}
			{message.reactions &&
				<div className='horizontalLayout'>
					{message.reactions.map((smiley) => <div key={`reaction-${smiley}`} className={`${smiley.split(",")[1] === auth.currentUser.uid ? "selectable userReaction" : ""}`} onClick={smiley.split(",")[1] === auth.currentUser.uid? () => removeReaction(message, smiley) : null}>{smiley.split(",")[0]}</div>)}
				</div>}
			{/* display the avalaible reactions */}
			<div className={`${message.uid === auth.currentUser.uid ? "right " : "left"} selectable`}><Reactions props={{displayReaction, selectingReaction, setSelectingReaction, selectedReaction, saveReaction}}/></div>
			<div className={`timeStamp ${message.uid === auth.currentUser.uid ? "alignRight " : ""}`} key={message.id + "timeStamp"}>{formatedDate}</div>
		</div>
	)
}
export default Message;
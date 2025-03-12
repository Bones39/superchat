import { useEffect, useRef, useState } from 'react';
import { CiImageOn } from "react-icons/ci";
import Message from "./Message";
import { RiArrowUpDoubleLine } from "react-icons/ri"

const Chatroom = ({props}) => {
	const {messages, formValue, sendMessage, sendImage, typing, setScrollIntoView, scrollIntoView, getNextMessagesBatch} = props;
	const dummyRef = useRef();
	const genericRef = useRef();
	const messagesReferencesArray = useRef(Array(messages.length).fill(null));
	const [displayPreviousButton, setDisplayPreviousButton ] = useState(false);


	useEffect(() => {
		// scroll to the end of the page when the user connects only when needed
		if (scrollIntoView) {
			// dummyRef?.current?.scrollIntoView();
			messagesReferencesArray?.current[24]?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages])

	return(
		<>
			<button className={displayPreviousButton? 'fadeIn' : 'fadeOut'} id='previousMessagesButton' onClick={getNextMessagesBatch}><RiArrowUpDoubleLine /></button>
			<div className="chatroom">
				{/* // chat room */}
				{messages && messages.map((message, index) =>
					{
						return <Message props={{messages, message, index, setScrollIntoView, scrollIntoView, messagesReferencesArray, setDisplayPreviousButton}} key={message.id}></Message>
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
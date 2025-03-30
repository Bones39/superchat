import { useEffect, useRef, useState } from 'react';
import { CiImageOn } from "react-icons/ci";
import Message from "./Message";
import { RiArrowUpDoubleLine } from "react-icons/ri";
import { GrSend } from "react-icons/gr";
import { RiSendPlaneFill } from "react-icons/ri";
import { LuImagePlus } from "react-icons/lu";

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
		<div className='chatZone'>
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
			<form className='messageInputForm' onSubmit={sendMessage}>
				<div class="inputContainer">
					<textarea className='messageInputArea' wrap='hard' cols='40' autoFocus='true' placeholder='  Miaou...' value={formValue} onChange={(e)=>typing(e)}/>
					<button type='submit' className='sendButton'><RiSendPlaneFill/></button>
				</div>
				<label className='customFileUpload'>
					<LuImagePlus/>
					<input className='fileInput' type='file' onChange={(e)=>sendImage(e)}/>
				</label>
			</form>
		</div>
	)
}

export default Chatroom;
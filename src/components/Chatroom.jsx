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
	const [controlPressed, setControlPressed] = useState();
	const [shiftPressed, setShiftPressed] = useState();
	const [enterPressed, setEnterPressed] = useState();
	const [isAnswering, setIsAnswering] = useState(false);
	const [messageClicked, setMessageClicked] = useState();
	const keyPressed = {};
	const inputRef = useRef()
	const inputTextArea = useRef()


	useEffect(() => {
		// scroll to the end of the page when the user connects only when needed
		if (scrollIntoView) {
			// dummyRef?.current?.scrollIntoView();
			messagesReferencesArray?.current[24]?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages])

	useEffect(() => {
		if (enterPressed && !shiftPressed) {
			// send the message if enter is pressed without shift
			document.getElementById('sendButton').click();
		}
	}, [controlPressed, enterPressed])

	const handleKeyDown = (event) => {
		if (event.key === 'Control') {
			setControlPressed(true);
		}
		if (event.key === 'Enter') {
			setEnterPressed(true);
		}
		if (event.key === 'Shift') {
			setShiftPressed(true);
		}
	};

	const handleKeyUp = (event) => {
		if (event.key === 'Control') {
			setControlPressed(false);
		}
		if (event.key === 'Enter') {
			setEnterPressed(false);
		}
		if (event.key === 'Shift') {
			setShiftPressed(false);
		}
	};

	return(
		<div className='chatZone'>
			<button className={`${displayPreviousButton? 'fadeIn' : 'fadeOut'} button`} id='previousMessagesButton' onClick={getNextMessagesBatch}><RiArrowUpDoubleLine /></button>
			<div className="chatroom">
				{/* // chat room */}
				{messages && messages.map((message, index) =>
					{
						return <Message props={{messages, message, index, setScrollIntoView, scrollIntoView, messagesReferencesArray, setDisplayPreviousButton, inputTextArea, isAnswering, setIsAnswering, setMessageClicked}} key={message.id}></Message>
					}
				)}
				<div ref={dummyRef}></div>
			</div>
			{isAnswering && <div>Is answering to {messageClicked}</div>}
			{/** display the form*/}
			<form className='messageInputForm' id='messageForm' ref={inputRef} onSubmit={sendMessage}>
				<div className="inputContainer">
					<textarea ref={inputTextArea} className='messageInputArea' id='messageInputValue' wrap='hard' cols='40' autoFocus={true} placeholder='  Miaou...' value={formValue} onChange={(e)=>typing(e)} onKeyDown={(e)=>{handleKeyDown(e)}} onKeyUp={handleKeyUp}/>
					<button type='submit' id='sendButton' className='sendButton'><RiSendPlaneFill/></button>
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
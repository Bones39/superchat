import { useEffect, useRef } from 'react';
import { CiImageOn } from "react-icons/ci";
import Message from "./Message";

const Chatroom = ({props}) => {
	const {messages, formValue, sendMessage, sendImage, typing} = props;
	const dummyRef = useRef();

	useEffect(() => {
		// scroll to the end of the page when the user connects
		dummyRef?.current?.scrollIntoView();
	}, [messages])

	return(
		<>
			<div className="chatroom">
				{/* // chat room */}
				{messages && messages.map((message, index) =>
					{
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
import { IoCloseCircleOutline } from "react-icons/io5";

const AnswerTo = ({props}) => {
	const {messages, messageClicked, setIsAnswering, answerToMessage, setAnswerToMessage} = props;

	const maxLength = 54;
	const originalMessage = messages.filter(message => message.id === messageClicked)[0].text;
	const savedMessage = originalMessage.length > maxLength ? `${originalMessage.slice(0, maxLength)}...` : originalMessage;
	setAnswerToMessage(savedMessage);

	return(
		<div id="answerContainer">
			<IoCloseCircleOutline id="closingIcon" size="1.3em" onClick={()=>setIsAnswering(false)}/>
			<div className='answerTo'>{savedMessage}</div>
		</div>
	)
}

export default AnswerTo;
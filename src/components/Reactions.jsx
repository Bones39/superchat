import { useEffect, useRef, useState } from "react";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import additionalSmileyArray from "../assets/additionnalReactionSmiley";

const Reactions = ({props}) => {
	const {displayReaction, selectingReaction, setSelectingReaction, selectedReaction, saveReaction} = props;
	let fadingTimeoutId = useRef();
	const [hovered, setHoverd] = useState('');
	// -----------------------------------------------------------
	const reactionArray = ['👍', '😄', '😥', '🤬', '🧡'];

	const onHover = (currentSmiley) => {
		clearTimeout(fadingTimeoutId);
		setHoverd(currentSmiley);
		// console.log(currentSmiley);
		setSelectingReaction(true);
	}

	const openAdditionnalReactions = () => {

	}

	const onLeave = () => {
		// console.log("reaction leaved!");
		fadingTimeoutId = setTimeout(() => {
			// the visibility of the reactions is also manage on the Message parent component
			setSelectingReaction(false);
		}, 600);
	}

	return (
		<div id="reactionContainer">
			<div className={`${(displayReaction || selectingReaction)? "" : "hidden"} horizontalLayout`} onMouseEnter={onHover} onMouseLeave={onLeave}>
				{reactionArray.map((smiley) => <div key={smiley} className="smiley" onClick={()=>saveReaction(smiley)}>{smiley}</div>)}
				<FaCirclePlus id="plusIcon" onClick={()=>console.log("ckicked!")}/>
				{/* <MdOutlineQuestionAnswer size="1.7em"/> */}
			</div>
			<div>{selectedReaction}</div>
			<div className={`${(displayReaction || selectingReaction)? "" : "hidden"} gridLayout`} onMouseEnter={onHover} onMouseLeave={onLeave}>
				{additionalSmileyArray.map((smiley) => <div key={smiley} className="smiley" onClick={()=>saveReaction(smiley)}>{smiley}</div>)}
			</div>
		</div>
	)
}
export default Reactions;
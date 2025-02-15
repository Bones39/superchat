import { useEffect, useRef, useState } from "react";

const Reactions = ({props}) => {
	const {displayReaction, selectingReaction, setSelectingReaction, selectedReaction, saveReaction} = props;
	let fadingTimeoutId = useRef();
	const [hovered, setHoverd] = useState('');
	// -----------------------------------------------------------
	const reactionArray = ['😄', '😥', '🤬', '🧡'];

	const onHover = (currentSmiley) => {
		clearTimeout(fadingTimeoutId);
		setHoverd(currentSmiley);
		console.log(currentSmiley);
		setSelectingReaction(true);
	}

	const onLeave = () => {
		console.log("reaction leaved!");
		fadingTimeoutId = setTimeout(() => {
			// the visibility of the reactions is also manage on the Message parent component
			setSelectingReaction(false);
		}, 600);
	}

	return (
		<div>
			<div className={`${(displayReaction || selectingReaction)? "" : "hidden"} horizontalLayout`} onMouseEnter={onHover} onMouseLeave={onLeave}>
				{reactionArray.map((smiley) => <div key={smiley} className="smiley" onClick={()=>saveReaction(smiley)}>{smiley}</div>)}
			</div>
			<div>{selectedReaction}</div>
		</div>
	)
}
export default Reactions;
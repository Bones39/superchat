const Linkify = ({originalText}) => {

	const urlRegex = /(https?:\/\/[^\s]+)/g;
	const splitedText = originalText.split(urlRegex);

	return(
	<span>
		{splitedText.map((part, index) => {
			if (urlRegex.test(part)) {
				return (
					<a key={index} href={part} target="_blank" rel="noopener noreferrer">
						{part}
					</a>
				);
			}
			return part;
		})}
    </span>
	);
}

export default Linkify;
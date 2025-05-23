const CatCarousel = ({props}) => {

	const {data, isLoading, setCatAvatarPicture} = props;

	if (isLoading) return <div>Loading...</div>

	const settings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 3
	};

	return(
		<div className="catPictureContainer">
			{data && data.map(element =>
				<img id="logInCatImages" src={element.url} alt="" key={element.url} onClick={() => setCatAvatarPicture(element.url)}/>
				// <div className="userTagLobby" style={{backgroundImage: `url("${element.url}")`, backgroundPosition: "center", backgroundSize: "110%"}}/>
			)}
		</div>
	)
}

export default CatCarousel;
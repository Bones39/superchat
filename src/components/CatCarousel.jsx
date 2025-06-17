import { FaCat } from "react-icons/fa";

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

	const setCustomCatImage = (e) => {
		e.preventDefault();
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.addEventListener("load", () => {
				setCatAvatarPicture(reader.result)
			})

			// read the binary data and encode it as base64 data url.
			reader.readAsDataURL(file);
		}

	}

	return(
		<div className="catPictureContainer">
			<label id="customCatImage">
				<FaCat/>
				<input className='fileInput' type='file' onChange={(e)=>setCustomCatImage(e)}/> {/* onChange={(e)=>sendImage(e)} */}
			</label>
			{data && data.map(element =>
				<div key={element.url.split("/")[4]}>
					<img id="logInCatImages" src={element.url} alt="" key={element.url} onClick={() => setCatAvatarPicture(element.url)}/>
				</div>
				// <div className="userTagLobby" style={{backgroundImage: `url("${element.url}")`, backgroundPosition: "center", backgroundSize: "110%"}}/>
			)}
		</div>
	)
}

export default CatCarousel;
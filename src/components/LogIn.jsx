import { useQuery } from '@tanstack/react-query';
import logoImage from '../assets/LogoSuperChatCroped.png'
import CatCarousel from "./CatCarousel"
import { useState } from 'react';

// miaoullias
// miaoussword
// demiaou un compte?

// create an account
// sign in
// https://thecatapi.com/

const LogIn = ({props}) => {

	const { data, isLoading } = useQuery({
		queryKey: ['logInCatImages'],
		queryFn: async () => {
			// using then statement leads to the following error: "Query data cannot be undefined. Please make sure to return a value other than undefined from your query function"
			const response = await fetch("https://api.thecatapi.com/v1/images/search?limit=7");
			const data = await response.json();
			setCatAvatarPicture(data[0].url)
			console.log(data);
			return data;
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false
	})

	// const [catAvatarPicture, setCatAvatarPicture] = useState();

	const {
		email,
		setEmail,
		password,
		setPassword,
		signIn,
		signInWithGoogle,
		catAvatarPicture,
		setCatAvatarPicture,
		userName,
		setUserName
	} = props;

	const catCarouselProps = {
		data,
		isLoading,
		setCatAvatarPicture
	}

	return (
		<div className="signInContainer">
			<form className="signInFormContainer" onSubmit={signIn}>
				<span></span>
				<header>Create an account</header>
				<input className="signInInput" type="text" placeholder='Emeowl' value={email} onChange={(e) => setEmail(e.target.value)}/>
				<input className="signInInput" type="text" placeholder='Usernamiaou' value={userName} onChange={(e) => setUserName(e.target.value)}/>
				<input className="signInInput" type="password" placeholder='miassword' value={password} onChange={(e) => setPassword(e.target.value)}/>
				<button className="button" onClick={signIn}>Sign In</button>
				-------------- or --------------
				<button className="button" onClick={signInWithGoogle}>Sign In with Google</button>
				<div className='logoSignIn'>
					<p>Super</p><img id="logInCatImages" src={catAvatarPicture? catAvatarPicture : logoImage} alt=''/><p>Chat</p>
				</div>
				<div className='carouselContainer'>
					<CatCarousel props={catCarouselProps}/>
				</div>
			</form>
		</div>
	)
}

export default LogIn;
import { useQuery } from '@tanstack/react-query';
import logoImage from '../assets/LogoSuperChatCroped.png'
import CatCarousel from "./CatCarousel"
import { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";

// miaoullias
// miaoussword
// demiaou un compte?

// create an account
// sign in
// https://thecatapi.com/

const LoginExistingAccount = ({props}) => {

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
		setUserName,
		logInError,
		setLogInError,
		switchToUserExistsPage,
		setSwitchToUserExistsPage,
		connectWithExistingAccount
	} = props;

	const catCarouselProps = {
		data,
		isLoading,
		setCatAvatarPicture
	}

	useEffect(()=> setLogInError(""));

	return (
		<div className="signInContainer">
			<div id='logingPhaseButtonContainer'>
				<button className='loginPhaseButton' onClick={() => setSwitchToUserExistsPage(false)}>Create an accout</button>
				<button className='loginPhaseButton active' disabled>Existing account</button>
			</div>
			<form className="signInFormContainer" onSubmit={signIn}>
				<span></span>
				{
					email ? 
					<div>
						<header>Glad to see you back</header>
						<header className='emphasized'>{userName}</header>
					</div>
					:
					<header>Who are you?</header>
				}
				<input className="signInInput" type="text" placeholder='Emeowl' value={email} onChange={(e) => setEmail(e.target.value)}/>
				<input className="signInInput" type="password" placeholder='miassword' value={password} onChange={(e) => setPassword(e.target.value)}/>
				<button className="button" onClick={connectWithExistingAccount}>Let's chat!</button>
				{email && <img id="logInCatAvatar" src={catAvatarPicture? catAvatarPicture : logoImage} alt=''/>}
			</form>
			<div id='loginErrorMessage'>{logInError}</div>
		</div>
	)
}

export default LoginExistingAccount;
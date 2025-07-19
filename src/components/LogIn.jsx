import { useQuery } from '@tanstack/react-query';
import logoImage from '../assets/LogoSuperChatCroped.png'
import CatCarousel from "./CatCarousel"
import { useEffect, useRef, useState } from 'react';

// miaoullias
// miaoussword
// demiaou un compte?

// create an account
// sign in
// https://thecatapi.com/

const LogIn = ({props}) => {

	const inputPasswordRef = useRef(null);
	const [error, setError] = useState(null);

	const emailRef = useRef();
	const nameRef = useRef();

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

	const checkPasswordConfirmation = (e) => {
		if (!e.target.value) {
			setError(true);
			setLogInError("Please confirm the password");
		} else if (e.target.value === inputPasswordRef.current.value) {
			setError(false);
			setLogInError("");
		} else {
			setError(true);
			setLogInError("Passwords are not identical");
		}
	}
	
	const resetError = (e) => {
		if (!e.target.value) {
			setError(false);
			setLogInError("");
		}
	}

	const {
		email,
		setEmail,
		signIn,
		password,
		setPassword,
		catAvatarPicture,
		setCatAvatarPicture,
		userName,
		setUserName,
		logInError,
		setLogInError,
		searchForExistingUser,
		setDisplayExistingUserPage,
		displayExistingUserPage
	} = props;

	const catCarouselProps = {
		data,
		isLoading,
		setCatAvatarPicture
	}


	const resetFormValue = () => {
		emailRef.current.value = "";
		nameRef.current.value = "";
	}
	useEffect(() => {
		// reset the value in the email field if we are coming from the existing user page
		resetFormValue();
	}, [displayExistingUserPage])

	return (
		<div className="signInContainer">
			<div id='logingPhaseButtonContainer'>
				<button className='loginPhaseButton active' disabled>Create an account</button>
				<button className='loginPhaseButton' onClick={() => setDisplayExistingUserPage(true)}>Existing account</button>
			</div>
			<form className="signInFormContainer" onSubmit={signIn}>
				<span></span>
				<header>Are you mew here?</header>
				<input ref={emailRef} className="signInInput" type="text" placeholder='Emeowl (a random one is ok)' value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => searchForExistingUser(email)}/>
				<input ref={nameRef} className="signInInput" type="text" placeholder='Usernamiaou (be creative)' value={userName} onChange={(e) => setUserName(e.target.value)}/>
				<input className="signInInput" type="password" placeholder='miassword' value={password} onChange={(e) => setPassword(e.target.value)}/>
				<input className={`signInInput ${error ? 'inputError' : ''}`} type="password" placeholder='confirm miassword' onBlur={(e) => checkPasswordConfirmation(e)}/>
				<button className="button" onClick={signIn}>Sign In</button>
				<div className='logoSignIn'>
					<p>Super</p><img id="logInCatImages" src={catAvatarPicture? catAvatarPicture : logoImage} alt=''/><p>Chat</p>
				</div>
				<div className='carouselContainer'>
					<CatCarousel props={catCarouselProps}/>
				</div>
			</form>
			<div id='loginErrorMessage'>{logInError}</div>
		</div>
	)
}

export default LogIn;
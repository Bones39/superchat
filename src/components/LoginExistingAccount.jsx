import { useQuery } from '@tanstack/react-query';
import logoImage from '../assets/LogoSuperChatCroped.png'
import { useEffect } from 'react';

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
		catAvatarPicture,
		setCatAvatarPicture,
		userName,
		logInError,
		setLogInError,
		connectWithExistingAccount,
		searchForExistingUser,
		setDisplayExistingUserPage,
		displayExistingUserPage,
		userFound
	} = props;

	useEffect(()=> {
		// setLogInError("");
		// since this will execute only if the page is display set it to true to avoid switching to create account as soon as the user is not found
		if (!displayExistingUserPage) {
			setDisplayExistingUserPage(true);
		}
	}/* ,[displayExistingUserPage, userFound] */);

	return (
		<div className="signInContainer">
			<div id='logingPhaseButtonContainer'>
				<button className='loginPhaseButton' onClick={() => setDisplayExistingUserPage(false)}>Create an account</button>
				<button className='loginPhaseButton active' disabled>Existing account</button>
			</div>
			<form className="signInFormContainer" onSubmit={connectWithExistingAccount}>
				<span></span>
				{
					userFound ? 
					<div>
						<header>Glad to see you back</header>
						<header className='emphasized'>{userName}</header>
					</div>
					:
					<header>Who are you?</header>
				}
				<input className="signInInput" type="text" placeholder='Emeowl' value={email} onChange={(e) => setEmail(e.target.value)} onBlur={(e) => searchForExistingUser(e.target.value)}/>
				<input className="signInInput" type="password" placeholder='miassword' value={password} onChange={(e) => setPassword(e.target.value)}/>
				<button className="button" onClick={connectWithExistingAccount}>Let's chat!</button>
				<img id="logInCatAvatar" src={userFound? catAvatarPicture : logoImage} alt=''/>
			</form>
			<div id='loginErrorMessage'>{logInError}</div>
		</div>
	)
}

export default LoginExistingAccount;
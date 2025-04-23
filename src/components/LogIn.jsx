import logoImage from '../assets/LogoSuperChatCroped.png'

const LogIn = ({props}) => {
	const {
		email,
		setEmail,
		password,
		setPassword,
		signIn,
		signInWithGoogle
	} = props;
	return (
		<div className="signInContainer">
			<form className="signInFormContainer" onSubmit={signIn}>
				<input className="signInInput" type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
				<input className="signInInput" type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
				<button className="button" onClick={signIn}>Sign In</button>
				<button className="button" onClick={signInWithGoogle}>Sign In with Google</button>
				<div className='logoSignIn'>
					<p>Super</p><img id="imageLogo" src={logoImage} alt=''/><p>Chat</p>
				</div>
			</form>
		</div>
	)
}

export default LogIn;
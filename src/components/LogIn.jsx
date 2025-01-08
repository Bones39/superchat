const LogIn = ({signIn, signInWithGoogle}) => {
	return (
		<div className="signIn">
			<input className="signInInput" type="text" placeholder='Email'/>
			<input className="signInInput" type="password" placeholder='password'/>
			<button className="signInInput" onClick={signIn}>Sign In</button>
			<button className="signInInput" onClick={signInWithGoogle}>Sign In with Google</button>
		</div>
	)
}

export default LogIn;
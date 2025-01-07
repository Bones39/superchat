const LogIn = ({signIn, signInWithGoogle}) => {
	return (
		<div className="signIn">
			{/* // chat room */}
			<input type="text" placeholder='Email'/>
			<input type="password" placeholder='password'/>
			<button onClick={signIn}>Sign In</button>
			<button onClick={signInWithGoogle}>Sign In with Google</button>
		</div>
	)
}

export default LogIn;
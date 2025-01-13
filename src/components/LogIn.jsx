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
		<form className="signIn" onSubmit={signIn}>
			<input className="signInInput" type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
			<input className="signInInput" type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
			<button className="signInInput" onClick={signIn}>Sign In</button>
			<button className="signInInput" onClick={signInWithGoogle}>Sign In with Google</button>
		</form>
	)
}

export default LogIn;
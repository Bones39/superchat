import { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import './App.css'

import firebase from 'firebase/compat/app'
import { Firestore } from 'firebase/firestore'
import { auth, googleProvider } from './firebaseConfig'

function App() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const signIn = async () => {
		try {
			await createUserWithEmailAndPassword(auth, email, password);
		} catch (error) {
			console.log(error);
		}
	}

	const signInWithGoogle = async () => {
		try {
			await signInWithPopup(auth, googleProvider);
			setEmail(auth?.currentUser?.email);
			console.log(auth?.currentUser?.email);
		} catch (error) {
			console.log(error);
		}
	}

	const logout = async () => {
		try {
			await signOut(auth);
			setEmail("");
			console.log(auth?.currentUser?.email);
		} catch (error) {
			console.log(error);
		}
	}

	console.log(auth?.currentUser?.email);
	
  return (
	<>
		{
			auth?.currentUser?
			<div>
				authentified as {auth?.currentUser?.email}
				<button onClick={logout}>Disconnect</button>
			</div> :
			<div>
				<input type="text" placeholder='Email'/>
				<input type="password" placeholder='password'/>
				<button onClick={signIn}>Sign In</button>
				<button onClick={signInWithGoogle}>Sign In with Google</button>
			</div>
		}
	</>
  )
}

export default App

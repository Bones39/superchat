import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import './App.css'

import { useCollectionData } from 'react-firebase-hooks/firestore'
import { auth, googleProvider, firestoreDb } from './firebaseConfig'
import { getDocs, collection, onSnapshot } from 'firebase/firestore';

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

	// ------- related to chatroom -------
	// get the messages collection
	const messagesRef = collection(firestoreDb, 'messages');
	const [messages, setMessages] = useState([]);
	// const query = messagesRef.orderBy('createdAt').limit(25);

	// const [messages] = useCollectionData();

	useEffect(() => {
		/* const getMessages = async () => {
			try {
				const dataSnapshot = await getDocs(messagesRef);
				const filterData = dataSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
				setMessages(filterData);
				console.log(filterData);
			} catch (error) {
				console.log(error);
			}
		}

		getMessages(); */

		const unsub = onSnapshot(messagesRef, (dataSnapshot) => {
			const filterData = dataSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
			setMessages(filterData);
			console.log(filterData);
		});

	}, [])

  return (
	<>
		{
			auth?.currentUser?
			<div>
				authentified as {auth?.currentUser?.email}
				<button onClick={logout}>Disconnect</button>
				{/* // chat room */}
				{messages && messages.map(message => <div key={message.id}>{message.text}</div>)}
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

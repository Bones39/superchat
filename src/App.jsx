import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import './App.css'

import { useCollectionData } from 'react-firebase-hooks/firestore'
import { auth, googleProvider, firestoreDb } from './firebaseConfig'
import { getDocs, collection, onSnapshot, addDoc, query, orderBy } from 'firebase/firestore';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore';


function App() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formValue, setFormValue] = useState("");

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
	const messageQuery = query(messagesRef, orderBy("createdAt"));
	const [messages, setMessages] = useState([]);

	const sendMessage = async (e) => {
		e.preventDefault();

		const {uid} = auth.currentUser;

		await addDoc(messagesRef, {
			text: formValue,
			uid,
			createdAt: firebase.firestore.FieldValue.serverTimestamp()
		})
	}

	useEffect(() => {
		const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
				const filterData = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
				setMessages(filterData);
				console.log(filterData);
			});

	}, [])

  return (
	<>
		{
			// component chat room
			auth?.currentUser?
			<div>
				authentified as {auth?.currentUser?.email}<br />
				user ID: {auth?.currentUser?.uid}
				<button onClick={logout}>Disconnect</button>
				{/* // chat room */}
				{messages && messages.map(message => <div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id}>{message.text}</div>)}
				{/* // form component */}
				<form onSubmit={sendMessage}>
					<input type="text" value={formValue} onChange={(e)=>setFormValue(e.target.value)}/>
					<button type='submit'>SEND</button>
				</form>
			</div> :
			// component authentification page
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

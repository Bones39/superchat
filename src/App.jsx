import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { useEffect, useRef, useState } from 'react'
import './App.css'

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { addDoc, collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import LogIn from './components/LogIn'
import Chatroom from './components/chatroom'
import { useAuth } from './context'
import { auth, firestoreDb, googleProvider } from './firebaseConfig'


function App() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formValue, setFormValue] = useState("");
	const { userIsLoggedIn, currentUser } = useAuth();

	const dummy = useRef();

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
	const userRef = collection(firestoreDb, 'Users')
	const messageQuery = query(messagesRef, orderBy("createdAt", "desc"), limit(25));
	const [messages, setMessages] = useState([]);

	const sendMessage = async (e) => {
		e.preventDefault();

		const {uid} = auth.currentUser;

		await addDoc(messagesRef, {
			text: formValue,
			uid,
			allias: currentUser.email.substring(0,3),
			// take the first to number in the ui
			photoId: currentUser.uid.split("").filter(e => /^\d/.test(e)).join('').substring(0,2),
			createdAt: firebase.firestore.FieldValue.serverTimestamp()
		});

		// reset the value in the input field once sent
		setFormValue("");

		// dummy.current.scrollIntoView();
	}

	const Props = {
		messages,
		dummy,
		sendMessage,
		formValue,
		setFormValue
	}

	useEffect(() => {
		const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
			const filterData = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
			setMessages(filterData.reverse());
			// console.log(filterData);
		});
	}, [])

  return (
	<main>
		{
			// component chat room
			userIsLoggedIn?
			<div>
				authentified as {auth?.currentUser?.email}<br />
				user ID: {auth?.currentUser?.uid}
				<button onClick={logout}>Disconnect</button>
				{/* Mettre les props dans un objet unique */}
				<Chatroom messages={messages} dummyRef={dummy} sendMessage={sendMessage} formValue={formValue} setFormValue={setFormValue}></Chatroom>
			</div>
			:
			// component authentification page
			<LogIn signIn={signIn} signInWithGoogle={signInWithGoogle}></LogIn>
		}
	</main>
  )
}

export default App

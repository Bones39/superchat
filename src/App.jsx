import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { useEffect, useRef, useState } from 'react'
import './App.css'

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { addDoc, deleteDoc, setDoc,collection, doc, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import LogIn from './components/LogIn'
import Chatroom from './components/chatroom'
import Lobby from './components/Lobby'
import { useAuth } from './context'
import { auth, firestoreDb, googleProvider } from './firebaseConfig'

// todo
/* 
- corriger le scrolling une fois un nouveau message envoyé OK
- créeer un composant qui liste les personnes connectée
- faire marcher le sign In
    - tester en mettant un <Form> OK
    - envoyer la valeur de password et mail dans la fonction signIn jusqu'à createUserWithEmailAndPassword (utiliser setPassword et setEmail) OK
*/


function App() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formValue, setFormValue] = useState("");
	const { userIsLoggedIn, currentUser } = useAuth();

	const dummy = useRef();
	const scrollHere = useRef();

		// ------- related to chatroom -------
	// get the messages collection
	const messagesRef = collection(firestoreDb, 'messages');
	const messageQuery = query(messagesRef, orderBy("createdAt", "desc"), limit(25));
	const [messages, setMessages] = useState([]);
	
	// ------- related to Lobby -------
	const connectedRef = collection(firestoreDb, 'connected');
	// const userRef = collection(firestoreDb, 'Users')
	const connectedQuery = query(connectedRef);
	const [connected, setConnected] = useState([]);

	const updateConnectionState = async (action) => {
		switch (action) {
			case "connection":
				await addDoc(connectedRef, {
					email: email
				});
		
			default:
				await addDoc(connectedRef, {
					email
				});
		}
	}

	const signIn = async (e) => {
		e.preventDefault();
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			// await updateConnectionState("connection");
			console.log("sign in: " + email);
			await setDoc(doc(firestoreDb, "connected", auth?.currentUser?.email), {
				email: auth?.currentUser?.email
			});
		} catch (error) {
			console.log(`${error}`);
			// chech if the error is beacaus the account already exists
			if (error.message.includes("email-already-in-use")) {
				await signInWithEmailAndPassword(auth, email, password);
				console.log("sign in: " + email);
				await setDoc(doc(firestoreDb, "connected", auth?.currentUser?.email), {
					email: auth?.currentUser?.email
				});
			}
		}
	}

	const signInWithGoogle = async () => {
		try {
			await signInWithPopup(auth, googleProvider);
			setEmail(auth?.currentUser?.email);
			// await updateConnectionState("connection");
			console.log("sign in: " + auth?.currentUser?.email);
			await setDoc(doc(firestoreDb, "connected", auth?.currentUser?.email), {
				email: auth?.currentUser?.email
			});
		} catch (error) {
			console.log(error);
		}
	}

	const logout = async () => {
		try {
			// await updateConnectionState("connection");
			await deleteDoc(doc(firestoreDb, "connected", auth?.currentUser?.email));
			console.log(auth?.currentUser?.email);
			setEmail("");
			await signOut(auth);
		} catch (error) {
			console.log(error);
		}
	}
	
	// r
	const sendMessage = async (e) => {
		e.preventDefault();

		if (formValue !== "") {
			const {uid} = auth.currentUser;
	
			await addDoc(messagesRef, {
				text: formValue,
				uid,
				allias: currentUser.email.substring(0,3),
				// take the first two number in the ui
				photoId: currentUser.uid.split("").filter(e => /^\d/.test(e)).join('').substring(0,2).replace(/^0/, ''),
				createdAt: firebase.firestore.FieldValue.serverTimestamp()
			});
	
			// reset the value in the input field once sent
			setFormValue("");
			dummy.current.scrollIntoView();
		}
	}

	const props = {
		messages,
		dummy,
		sendMessage,
		formValue,
		setFormValue
	}

	const signInProps = {
		email,
		setEmail,
		password,
		setPassword,
		signIn,
		signInWithGoogle
	}

	const lobbyProps = {
		connected
	}

	useEffect(() => {
		const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
			const filterData = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
			setMessages(filterData.reverse());
			scrollHere.current.scrollIntoView();
		});

		const un = onSnapshot(connectedQuery, (querySnapshot) => {
			const connectedUsers = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
			setConnected(connectedUsers);
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
				<Chatroom props={props} ></Chatroom>
				<div ref={scrollHere}></div>
				<Lobby props={lobbyProps}></Lobby>
			</div>
			:
			// component authentification page
			<LogIn props={signInProps}></LogIn>
		}
	</main>
  )
}

export default App

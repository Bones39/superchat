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
- permettre d'envoyer des gifs
- redimenionner les photos de profils
- travaIller sur le style: EN COURS
	- rendre le site responsive
	- améliorer l'esthetique globale
	- ajouter la photo et l'allias avant le nom OK
	- changer la taille et le family font
	- redimensionner les photos de profil dans le lobby OK
- ajouter l'animation des points de suspension quand l'utilisateur est en train d'ecrire OK
- deconnecterles utilisateurs quand on ferme l'onglet OK
- corriger le scrolling quand on se connecte une premiere fois OK
- faire une unique fontion pour set les different state photoId et allias lorsqu'on se connect et se deco (prendre ce qu'il y a entre les lignes 91 et 99) OK
	- appeler cette fonction dans signIn(try et catch) et dans signInWithGoogle OK
- créeer un composant qui liste les personnes connectée OK
	- commencer par faire marcher la visibilité en fonction de l'état de connexion  OK
	- trouver un moyen de deconnecter l'utilisateur qd l'onglet est fermé OK
		=> fait avec un window.open('/') pour que le code puisse s'executer dans un contexte/fenetre OK
- corriger le scrolling une fois un nouveau message envoyé OK
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
	const [isTyping, setIsTyping] = useState(false);
	let timerId = useRef(null);
	
	// ------- related to Lobby -------
	const connectedRef = collection(firestoreDb, 'connected');
	// const userRef = collection(firestoreDb, 'Users')
	const connectedQuery = query(connectedRef);
	const [connected, setConnected] = useState([]);
	const [photoId, setPhotoId] = useState("");
	const [allias, setAllias] = useState("");

	const updateConnectionState = async (action) => {
		if (action === "connection") {
			await setDoc(doc(firestoreDb, "connected", auth?.currentUser?.email), {
				email: auth?.currentUser?.email,
				allias: auth?.currentUser?.email.substring(0,3),
				photoId: auth?.currentUser?.uid.split("").filter(e => /^\d/.test(e)).join('').substring(0,2).replace(/^0/, '')
			});
			if (auth.currentUser) {
				// set the states to be used in component
				setPhotoId(auth.currentUser.uid.split("").filter(e => /^\d/.test(e)).join('').substring(0,2).replace(/^0/, ''));
				setAllias(auth.currentUser.email.substring(0,3))
			};
		} else {
			await deleteDoc(doc(firestoreDb, "connected", auth?.currentUser?.email));
		}
	}

	const signIn = async (e) => {
		e.preventDefault();
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			setEmail(auth?.currentUser?.email);
			console.log("sign in: " + email);
			updateConnectionState("connection");
		} catch (error) {
			console.log(`${error}`);
			// check if the error is beacaus the account already exists
			if (error.message.includes("email-already-in-use")) {
				await signInWithEmailAndPassword(auth, email, password);
				setEmail(auth?.currentUser?.email);
				console.log("sign in: " + email);
				updateConnectionState("connection");
			}
		}
	}

	const signInWithGoogle = async () => {
		try {
			await signInWithPopup(auth, googleProvider);
			setEmail(auth?.currentUser?.email);
			console.log("signInWithGoogle sign in: " + auth?.currentUser?.email);
			updateConnectionState("connection");
		} catch (error) {
			console.log("signInWithGoogle " + error.message);
		}
	}

	const logout = async () => {
		try {
			updateConnectionState();
			setEmail("");
			await signOut(auth);
		} catch (error) {
			console.log(error);
		}
	}
	
	const sendMessage = async (e) => {
		e.preventDefault();

		if (formValue !== "") {
			const {uid} = auth.currentUser;
	
			await addDoc(messagesRef, {
				text: formValue,
				uid,
				allias: allias,// currentUser.email.substring(0,3),
				// take the first two number in the ui
				photoId: photoId, //currentUser.uid.split("").filter(e => /^\d/.test(e)).join('').substring(0,2).replace(/^0/, ''),
				createdAt: firebase.firestore.FieldValue.serverTimestamp()
			});
	
			// reset the value in the input field once sent
			setFormValue("");
			dummy.current.scrollIntoView();
			// when the message has been sent, the user is not considered typing anymore
			/* await setDoc(doc(firestoreDb, "connected", auth?.currentUser?.email), {
				isTyping: false
			},
			{ merge: true }); */
		}
	}
	
	const typing = async (e) => {
		// set the form value first to avoid latency
		setFormValue(e.target.value);
		console.log("isTyping: " + isTyping);
		if (!isTyping) {
			if (timerId) clearTimeout(timerId);
			setIsTyping(true);
			// set a time out to set typing to false after 3 sec
			setTimeout(async () => {
				await setDoc(doc(firestoreDb, "connected", auth?.currentUser?.email), {
					isTyping: false
					},
					{ merge: true }
				);
				setIsTyping(false);
			},
			2500);
			// Set typing to true 
			await setDoc(doc(firestoreDb, "connected", auth?.currentUser?.email), {
				isTyping: true
			},
			{ merge: true });
			// clearTimeout(id);
		}
	}

	const props = {
		messages,
		dummy,
		sendMessage,
		formValue,
		typing
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
		});

		const un = onSnapshot(connectedQuery, (querySnapshot) => {
			const connectedUsers = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
			setConnected(connectedUsers);
		});

		window.addEventListener('beforeunload', (event) => {
			// disconnect user if the tab is closed
			window.open('/');
			updateConnectionState();
		});

		// the use effect is called only once, ie when the connection page appears (not called again if the user connect unless some dependencies are put in the dep array)
		// scrollHere?.current?.scrollIntoView();
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

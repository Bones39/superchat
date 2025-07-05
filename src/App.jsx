import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { useEffect, useRef, useState } from 'react'
import './App.css'

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, setDoc, where, or, getDocs, startAfter } from 'firebase/firestore'
import Chatroom from './components/Chatroom'
import Lobby from './components/Lobby'
import LogIn from './components/LogIn'
import LoginExistingAccount from './components/LoginExistingAccount'
import logoImage from './assets/LogoSuperChatCroped.png'
import UserDetails from './components/UserDetails'
import { useAuth } from './context'
import { auth, firestoreDb, googleProvider } from './firebaseConfig'

// todo
/* 
 ------------- EN COURS --------------------
 - ajouter la possibilité de supprimer ou de modifier son message 
 - prendre en compte les liens hypertext
 - utiliser tanstackquery pour sauvegarder les cookies
 - corriger la connexion EN COURS
 - des fois l'utilisateur se deconnecte sans raison, notemment quand on refresh - cloud fonction pour gérer le autodisconnect
 - creer une fonction qui deconnecte les utilisateurs inactifs (pas l'utilisateur actuel) -> could function
 - revoir la cloud fonction car les users inactifs ne sont pas deconnectés
 - voir la vidéo pour faire apparaitre la barre de smiley https://www.youtube.com/watch?v=DNXEORSk4GU&t=616s
 - ajouter le scroll pour consulter les anciens messages OK
 - utiliser tanstack query, mettre les éléments chargés dans un cache
 - utiliser reactStately et useAsyncList https://www.youtube.com/watch?v=nR85ayDEVBc&t=132s
 ------------- FAIT --------------------
 - changer les photos de profil en photo de chat: https://cataas.com/doc.html OK
- ajouter les whiiiz OK
		- pour l'animation du wiiz: https://www.youtube.com/watch?v=ZqLWNxsFz_o
- Modifier la page d'accueil pour ne prendre en compte que le nom OK
- ajouter les whiiiz OK
 	- gerer le cas où la notif reste 1/2 sec OK
		- tester de mettre un snapshot sur une query qui récupère la donnée filtrée par utilisateur et par date (utiliser le threshold)
		- finalement 2 composants indépendant ont été créés, un pour envoyer et un autre pour lire les wiiz OK
	- mettre un boolean quand la ligne est lu et utiliser ce boolean pour dire si on affiche ou non le wiiz EN COURS 
	- envoyer les users wizzed via le serveur OK
	- corriger le fait que des fois l'audio de la notif ne se lance pas de suite https://stackoverflow.com/questions/55026293/google-chrome-javascript-issue-in-getting-user-audio-the-audiocontext-was-not
-ajouter les reactions aux messages (smiley) OK
	- gérer le cas où on quitte et on revient sur le message en hover, le timout doit etre reset pour que les reactions restent affichées
	- faire apparaitre les smileys lorsqu'on clique sur le message, non plus quand on le survole OK
	- permettre d'ajouter des smileys OK
	- permettre de supprimer des smileys (les siens) OK
	- stocker les infos du smiley en base OK
- permettre d'envoyer des gifs OK
 - corriger la taille des images OK
	- afficher les images dans un contenaire a taille fixe et adapter la taille de l'image a ce contenaire OK
 - corriger la place de la date d'envoi de message reçu OK
- prendre en compte la date de derniere activité OK
	- deconnecter les utilisateurs inactifs OK
- permettre d'envoyer des images, encoder en base 64 OK
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
	const [catAvatarPicture, setCatAvatarPicture] = useState();
	const [userName, setUserName] = useState();

	// const dummy = useRef();
	// const scrollHere = useRef();

		// ------- related to chatroom -------
	const batchQueryParam = 25;
	let lastQueriedMessageTimeStamp = useRef(null);
	// get the messages collection
	const messagesRef = collection(firestoreDb, 'messages');
	const messageQuery = query(messagesRef, orderBy("createdAt", "desc"), limit(batchQueryParam));
	const olderMessageQuery = query(messagesRef, orderBy("createdAt", "desc"), startAfter(lastQueriedMessageTimeStamp.current), limit(batchQueryParam));
	const [messages, setMessages] = useState([]);
	const [isTyping, setIsTyping] = useState(false);
	const [isInactive, SetIsInactive] = useState(false);
	const [scrollIntoView, setScrollIntoView] = useState(true);
	const [switchToUserExistsPage, setSwitchToUserExistsPage] = useState(false);
	const [userFound, setUserFound] = useState(false);
	const [displayExistingUserPage, setDisplayExistingUserPage] = useState(false);
	let timerId = useRef(null);
	let intervalId = useRef(null);
	// set the inactivity time upon deconnexion
	const inactivityDelayMinutes = 60;
	
	// ------- related to Lobby -------
	const connectedRef = collection(firestoreDb, 'connected');
	const userRef = collection(firestoreDb, 'users');
	const connectedQuery = query(connectedRef);
	const [connected, setConnected] = useState([]);
	const [photoId, setPhotoId] = useState(auth?.currentUser?.uid.split("").filter(e => /^\d/.test(e)).join('').substring(0,2).replace(/^0/, ''));
	const [allias, setAllias] = useState(auth?.currentUser?.email.substring(0,3));
	const [logInError, setLogInError] = useState('');

	const updateConnectionState = async (action) => {
		if (action === "connection") {
			// add the entry to the connected users table
			await setDoc(doc(firestoreDb, "connected", auth?.currentUser?.email), {
				email: auth?.currentUser?.email,
				allias: auth?.currentUser?.email.substring(0,3),
				photoId: auth?.currentUser?.uid.split("").filter(e => /^\d/.test(e)).join('').substring(0,2).replace(/^0/, ''),
				catAvatarImageUrl: catAvatarPicture,
				userName: userName,
				lastActivityDate: firebase.firestore.FieldValue.serverTimestamp()
			});
			if (auth.currentUser) {
				// set the states to be used in component
				setPhotoId(auth.currentUser.uid.split("").filter(e => /^\d/.test(e)).join('').substring(0,2).replace(/^0/, ''));
				setAllias(auth.currentUser.email.substring(0,3))
			};
			// initialize the wizz entry table for the current user
			await setDoc(doc(firestoreDb, "wizzActions", auth?.currentUser?.email), {
				date: firebase.firestore.FieldValue.serverTimestamp()
			});
		} else {
			await deleteDoc(doc(firestoreDb, "connected", auth?.currentUser?.email));
		}
	}

	/**
	 * Function called to create a user table to save additionnal parameters
	 */
	const createUser = async () => {
		await setDoc(doc(firestoreDb, 'users', email), {
			email: email,
			username: userName,
			catAvatarImageUrl: catAvatarPicture,
		})
	}

	const searchForExistingUser = async (userEmail) => {
		const userRef = collection(firestoreDb, "users");
		// const docSnap = await getDoc(userRef);
		// reset avatar picture
		const queryOptions = query(userRef, where("email", "==", userEmail));
		const querySnapshot = await getDocs(queryOptions);
		if (!querySnapshot.empty) {
			setUserFound(true);
			querySnapshot.forEach(doc => {
				if (doc.data().hasOwnProperty("email")) {
					setUserName(doc.data().username);
					setEmail(doc.data().email);
					setCatAvatarPicture(doc.data().catAvatarImageUrl);
				}
			})
		} else {
			setUserFound(false);
		}
	}

	const signIn = async (e) => {
		e.preventDefault();
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			setEmail(auth?.currentUser?.email);
			console.log("sign in: " + email);
			updateConnectionState("connection");
			createUser();
		} catch (error) {
			console.log(`${error}`);
			setLogInError(error.message);
		}
	}
	
	const connectWithExistingAccount = async (e) => {
		e.preventDefault();
		try {
			await signInWithEmailAndPassword(auth, email, password);
			setEmail(auth?.currentUser?.email);
			console.log("sign in: " + email);
			updateConnectionState("connection");
		} catch (error) {
			console.log(`${error}`);
			setLogInError(error.message);
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

	const automaticDisconnect = async () => {
		console.log("in automaticDisconnect");
		// search for user that should be disconnected (due to reapplied cached data they are not)
		let queryOptions = query(connectedRef/* , or(where("email", "==", null), where("email", "==", "")) */);
		let querySnapshot = await getDocs(queryOptions);
		querySnapshot.forEach(async (doc) => {
		// doc.data() is never undefined for query doc snapshots
			console.log(doc.id, " => ", doc.data());
			// delete the record of the current user
			if (doc.id === auth?.currentUser?.email && !doc.data().hasOwnProperty("email")) {
				// await deleteDoc(doc(firestoreDb, "connected", doc.id));
				await deleteDoc(doc.ref/* doc(firestoreDb, "connected", auth?.currentUser?.email) */);
				console.log(`user ${doc.id} should be loged out!`);
				// this logout the current user
				logout();
			} else if (!doc.data().hasOwnProperty("email")) {
				console.log(`user ${doc.id} should be loged out! but do it will be done server side automatically!`);
			}
		});
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
				catAvatarImageUrl: connected?.filter(user => user.email === auth?.currentUser?.email)[0].catAvatarImageUrl || "", // catAvatarPicture || "",
				createdAt: firebase.firestore.FieldValue.serverTimestamp()
			});
	
			// reset the value in the input field once sent
			setFormValue("");
			setScrollIntoView(true);
			// dummy.current.scrollIntoView();
			// when the message has been sent, the user is not considered typing anymore
			/* await setDoc(doc(firestoreDb, "connected", auth?.currentUser?.email), {
				isTyping: false
			},
			{ merge: true }); */
		}
	}

	const sendImage = async (e) => {
		e.preventDefault();

		const file = e.target.files[0];
		if (file) {
			const {uid} = auth.currentUser;
			const reader = new FileReader();

			reader.addEventListener("load", async () => {
				await addDoc(messagesRef, {
					text: reader.result,
					uid,
					allias: allias,// currentUser.email.substring(0,3),
					// take the first two number in the ui
					photoId: photoId, //currentUser.uid.split("").filter(e => /^\d/.test(e)).join('').substring(0,2).replace(/^0/, ''),
					type: "image",
					createdAt: firebase.firestore.FieldValue.serverTimestamp()
				});
			})

			// read the binary data and encode it as base64 data url.
			reader.readAsDataURL(file);
	
			// reset the value in the input field once sent
			setFormValue("");
			// dummy.current.scrollIntoView();
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
				isTyping: true,
				lastActivityDate: firebase.firestore.FieldValue.serverTimestamp()
			},
			{ merge: true });
			// clearTimeout(id);
		}
	}

	const getNextMessagesBatch = async () => {
		const olderMessagesSnap = await getDocs(olderMessageQuery);
		const olderMessages = olderMessagesSnap.docs.map(doc => ({...doc.data(), id: doc.id}));
		// update messages array
		setMessages(messages => [...olderMessages.reverse(), ...messages]);
		// take the last element as the begining of the next query (reverse is destructive, the last element is in the first index of the array)
		lastQueriedMessageTimeStamp.current = olderMessages[0].createdAt;
	}

	const props = {
		messages,
		// dummy,
		sendMessage,
		sendImage,
		formValue,
		typing,
		setScrollIntoView,
		scrollIntoView,
		getNextMessagesBatch
	}

	const signInProps = {
		email,
		setEmail,
		password,
		setPassword,
		signIn,
		signInWithGoogle,
		catAvatarPicture,
		setCatAvatarPicture,
		userName,
		setUserName,
		logInError,
		setLogInError,
		searchForExistingUser,
		switchToUserExistsPage,
		setSwitchToUserExistsPage,
		connectWithExistingAccount,
		setDisplayExistingUserPage,
		displayExistingUserPage,
		userFound
	}

	const lobbyProps = {
		connected
	}

	const headerProps = {
		currentUser : connected.filter(user => user.email === auth?.currentUser?.email)[0]
	}

	useEffect(() => {
		const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
			const filterData = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
			setMessages(filterData.reverse());
			// take the last element as the begining of the next query (initialization)
			if (!lastQueriedMessageTimeStamp.current) lastQueriedMessageTimeStamp.current = filterData[0].createdAt
		});

		// check if the current user is to be disconnected
		automaticDisconnect();

		const un = onSnapshot(connectedQuery, (querySnapshot) => {
			const connectedUsers = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
			setConnected(connectedUsers);
		});

		/* window.addEventListener('beforeunload', (event) => {
			// disconnect user if the tab is closed
			window.open('/');
			updateConnectionState();
		}); */

		// set up an interval to check for inactive users and disconnect them automatically
		/* intervalId.current = setInterval(()=> {
			// automaticDisconnect();
		}, inactivityDelayMinutes*60*1000) */
		// the use effect is called only once, ie when the connection page appears (not called again if the user connect unless some dependencies are put in the dep array)
		// scrollHere?.current?.scrollIntoView();

		// if (auth?.currentUser?.email === wizzedUser) 
		return () => {
			unsubscribe();
			un();
			clearInterval(intervalId.current);
		};
	}, [])

  return (
	<main>
		{
			// component chat room
			userIsLoggedIn?
			<div className='mainContainer'>
				<div className='header'>
					<div className='logo'>
						<p>Super</p><img id="imageLogo" src={logoImage} alt=''/><p>Chat</p>
					</div>
					<div className='authInfos'>
						{/* authentified as {auth?.currentUser?.email}<br />
						user ID: {auth?.currentUser?.uid} */}
						<UserDetails headerProps={headerProps}></UserDetails>
					</div>
					<div className='disonnectButton'>
						<button className="button" onClick={logout}>Disconnect</button>
					</div>
				</div>
				<div className='appBodyContainer'>
					<Lobby props={lobbyProps}></Lobby>
					<Chatroom props={props} ></Chatroom>
				</div>
			</div>
			// switch to existing user page if "existing account" clicked or if while on creating account page a user was found
			: displayExistingUserPage || (!displayExistingUserPage && userFound) ?
				// component authentification page
				<LoginExistingAccount props={signInProps}></LoginExistingAccount>
				:
				<LogIn props={signInProps}></LogIn>
		}
	</main>
  )
}

export default App

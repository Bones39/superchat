import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import './App.css'

import { useCollectionData } from 'react-firebase-hooks/firestore'
import { auth, googleProvider, firestoreDb } from './firebaseConfig'
import { getDocs, collection, onSnapshot, addDoc, query, orderBy, limit } from 'firebase/firestore';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore';
import { useAuth } from './context'


function App() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formValue, setFormValue] = useState("");
	const { userIsLoggedIn, currentUser } = useAuth();

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
			allias: currentUser.email.substring(0,2),
			// take the first to number in the ui
			photoId: currentUser.uid.split("").filter(e => /^\d/.test(e)).join('').substring(0,2),
			createdAt: firebase.firestore.FieldValue.serverTimestamp()
		});

		// reset the value in the input field once sent
		setFormValue("");
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
				<div className="chatroom">
					{/* // chat room */}
					{messages && messages.map((message, index) =>
						index !== 0 && messages[index-1].uid !== message.uid && message.uid !== auth.currentUser.uid?
						// add a div containing the user if the message is a new message -> put this in a new component!!
							<div key={message.id + 'div'}>
								<div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} userTag`} key={message.id + 'tag'} style={{backgroundImage: `url("https://randomuser.me/api/portraits/men/${message.photoId}.jpg")`}}>{message.allias}</div>
								<div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id}>{message.text}</div>
							</div>
						:
						index === 0 && message.uid !== auth.currentUser.uid?
							<div key={message.id + 'div2'}>
								<div className={`${message.uid === auth.currentUser.uid ? "sent" : "received"} userTag`}>{message.allias}</div>
								<div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id}>{message.text}</div>
							</div>
						:
						<div className={message.uid === auth.currentUser.uid ? "sent" : "received"} key={message.id}>{message.text}</div>
					)}
				</div>
				{/* // form component */}
				<form className='messageInput' onSubmit={sendMessage}>
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
	</main>
  )
}

export default App

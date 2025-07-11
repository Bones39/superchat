import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth () {
	return useContext(AuthContext);
}

// set user auth:  https://www.youtube.com/watch?v=WpIDez53SK4

export function AuthProvider({children}) {
	const [currentUser, setCurrentUser] = useState(null);
	const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, initializeUser);
		return unsubscribe;	
	}, [])

	async function initializeUser(user) {
		if (user) {
			setCurrentUser({...user});
			setUserIsLoggedIn(true);
		} else {
			setCurrentUser(null);
			setUserIsLoggedIn(false);
		}
		setLoading(false);
	}
	
	const value = {
		currentUser,
		setUserIsLoggedIn,
		userIsLoggedIn,
		loading
	}

	return (
		<AuthContext.Provider value={value}>
			{ !loading && children }
		</AuthContext.Provider>
	)
} 
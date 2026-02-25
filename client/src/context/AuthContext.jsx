import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);

    function signUp(email, password) {
        // Basic sign up not requested, but could be added
    }

    function logIn(email, password) {
        // Basic log in not requested, but could be added
    }

    function googleSignIn() {
        return signInWithPopup(auth, googleProvider);
    }

    function logOut() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function UserAuth() {
    return useContext(AuthContext);
}

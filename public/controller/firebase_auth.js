
import { 
    getAuth, signInWithEmailAndPassword, 
    onAuthStateChanged, signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"
import { app } from "./firebase_core.js";
import { homePageView } from "../view/home_page.js";
import { signinPageView } from "../view/signin_page.js";

const auth = getAuth(app);

export async function signinFirebase(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
   
    try {
       const userCredential = await signInWithEmailAndPassword(auth, email, password);
       //const user = userCredential.user;
    } catch (error) {
        if (DEV) console.log('signin error: ', error);
        const errorCode = error.code;
        const errorMessage = error.message;
alert('Signin Error: ' + errorCode + ' ' + errorMessage);

    }
}
export function attachAuthStateChangeObserver() {
    onAuthStateChanged(auth, authStateChangeListener);

}
function authStateChangeListener(user) {
    if (user) {
       homePageView();

    } else {
        signinPageView();

    }
}
export async function signOutFirebase() {
await signOut(auth);

}
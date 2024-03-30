import { currentUser } from "../controller/firebase_auth.js";
import {root} from "./elements.js"
import { protectedView } from "./protected_view.js";

export async function SharedWithPageView(){
    if(!currentUser){
        root.innerHTML =await protectedView();
        return;
    }
    root.innerHTML='<h1>Shared With Page</h1';
}
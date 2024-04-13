import { currentUser } from "../controller/firebase_auth.js";
import { getSharedWithPhotoMemoList } from "../controller/firestore_controller.js";
import {root} from "./elements.js"
import { createPhotoMemoView } from "./home_page.js";
import { protectedView } from "./protected_view.js";

export async function SharedWithPageView(){
    if(!currentUser){
        root.innerHTML =await protectedView();
        return;
    }
    
    const response = await fetch('/view/templates/sharedwith_page_template.html',
        { cache: 'no-store' });
    const divWrapper = document.createElement('div');
    divWrapper.innerHTML = await response.text();
    divWrapper.classList.add('m-4', 'p-4')

    root.innerHTML = '';
    root.appendChild(divWrapper);

    const sharedWithRoot=divWrapper.querySelector('#shared-with-root');

    sharedWithRoot.innerHTML='<h2>Loading ....</h2>';
    let sharedWithList;
    try{
        sharedWithList=await getSharedWithPhotoMemoList(currentUser.email);
    } catch (e){
        console.log('Failed to load:', e);
        alert('Failed to load: ' +JSON.stringify(e));
        sharedWithRoot.innerHTML='';
        return;
    }
    if (sharedWithList.length==0){
        sharedWithRoot.innerHTML='<h2>No photomemos have been shared with me</h2>';
        return;
    }
    sharedWithRoot.innerHTML='';
    sharedWithList.forEach(p => {
        const cardView=createPhotoMemoView(p);
        sharedWithRoot.appendChild(cardView);
    })
}
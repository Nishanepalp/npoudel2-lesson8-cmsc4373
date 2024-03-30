import { currentUser } from "../controller/firebase_auth.js";
import { root } from "./elements.js"
import { protectedView } from "./protected_view.js";
import { onChangeImageFile, onClickCreateButton, onClickCreateForm2ValidateSharedWith, onSubmitCreateForm } from "../controller/home_controller.js";
import { getPhotoMemoList } from "../controller/firestore_controller.js";

let photoMemoList = null;

export function prependPhotoMemoList(p){
    photoMemoList.splice(0, 0, p);
}

export function resetPhotoMemoList(){
    photoMemoList=null;
}

export async function homePageView() {
    if (!currentUser) {
        root.innerHTML = await protectedView();
        return;
    }

    const response = await fetch('/view/templates/home_page_template.html',
        { cache: 'no-store' });
    const divWrapper = document.createElement('div');
    divWrapper.innerHTML = await response.text();
    divWrapper.classList.add('m-4', 'p-4')

    divWrapper.querySelector('#button-create').onclick = onClickCreateButton;
    divWrapper.querySelector('#form-create').onsubmit = onSubmitCreateForm;
    divWrapper.querySelector('#form-create').onclick = onClickCreateForm2ValidateSharedWith;
    divWrapper.querySelector('#image-file-input').onchange = onChangeImageFile;
    let homeRoot = divWrapper.querySelector('#home-root');


    root.innerHTML = '';
    root.appendChild(divWrapper);

    if (photoMemoList == null) { 
        homeRoot.innerHTML='<h2>Loading ...</h2>';
        try {
            photoMemoList = await getPhotoMemoList(currentUser.uid);
        } catch (e) {
            homeRoot.innerHTML='';
            console.log('failed to read: ', e);
            alert('Failed to get photomemo list:' + JSON.stringify(e));
            return;
        }
    }

    if (photoMemoList.length==0){
        homeRoot.innerHTML='<h2>No photomemo has been added!</h2>';
        return;
    }

    homeRoot.innerHTML='';
    photoMemoList.forEach(p => {
        const cardView = createPhotoMemoView(p);
        homeRoot.appendChild(cardView);
    });
}

function createPhotoMemoView(photoMemo) {
    const cardView = document.createElement('div');
    cardView.classList.add('card', 'd-inline-flex');
    cardView.style = 'width: 18rem;';

    const img = document.createElement('img');
    img.src = photoMemo.imageURL;
    img.classList.add('card-img-top');
    cardView.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardView.appendChild(cardBody);

    const h5 = document.createElement('h5');
    h5.innerHTML = photoMemo.title;
    h5.classList.add('card-title');
    cardBody.appendChild(h5);


    const p = document.createElement('p');
    p.classList.add('card-text');
    p.innerHTML = `
        ${photoMemo.memo}<br>
        <hr>
        Created By: ${photoMemo.createdBy}<br>
        Created At: ${new Date(photoMemo.timestamp).toLocaleString()}<br>
        SharedWith: ${photoMemo.sharedWith.join('; ')}
    `;
    cardBody.appendChild(p);

    return cardView;
}
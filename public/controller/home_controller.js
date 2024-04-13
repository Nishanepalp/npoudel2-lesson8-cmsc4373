import { PhotoMemo } from "../model/PhotoMemo.js";
import { editOverlayModal, homePageView, prependPhotoMemoList, removeFromPhotoMemoList, reorderPhotoMemoList } from "../view/home_page.js";
import { deleteImage, uploadImage } from "./cloudstorage_controller.js";
import { currentUser } from "./firebase_auth.js";
import { addPhotoMemo, deletePhotoMemo, searchImageByClassName, updatePhotoMemo } from "./firestore_controller.js";
import { imageClassifier } from "./vision_ml.js";

let imageFile = null;

export async function onClickCreateButton(e) {
    const divCreateButton = document.querySelector('#div-create-button');
    const divCreateForm = document.querySelector('#div-create-form');
    divCreateButton.classList.replace('d-block', 'd-none');
    divCreateForm.classList.replace('d-none', 'd-block');

}
export function onClickCreateForm2ValidateSharedWith(e) {
    const sharedWithInput = document.getElementById('shared-with');
    const validity=PhotoMemo.validateSharedWith(sharedWithInput.value);
    if(validity==''){
        sharedWithInput.setCustomValidity('');
    } else {
        sharedWithInput.setCustomValidity('Unacceptable: '+validity);
    }
    
}

export async function onSubmitCreateForm(e) {
    e.preventDefault();

    if (e.submitter.value == 'cancel') {
        const divCreateButton = document.querySelector('#div-create-button');
        const divCreateForm = document.querySelector('#div-create-form');
        divCreateButton.classList.replace('d-none', 'd-block');
        divCreateForm.classList.replace('d-block', 'd-none');
        return;
    }

    const buttonLabel = e.submitter.innerHTML;
    e.submitter.disabled = true;
    e.submitter.innerHTML = 'Wait...';

    

    let imageName, imageURL;
    try {
        const result = await uploadImage(imageFile);
        imageName = result.imageName;
        imageURL = result.imageURL;
    } catch (error) {
        console.log('Upload image failed', error);
        alert('Failed to upload image: ' + JSON.stringify(error));
        e.submitter.innerHTML = buttonLabel;
        e.submitter.disabled = false;
        return;
    }

    const imgElement=document.getElementById('img-tag');
    const imageClasses=await imageClassifier(imgElement);

    const title = e.target.title.value.trim();
    const memo = e.target.memo.value.trim();
    const uid = currentUser.uid;
    const createdBy = currentUser.email;
    const elist = e.target.sharedWith.value.trim();
    const sharedWith = elist.split(/[,|;| ]+/);
    const timestamp = Date.now();

    const photoMemo = new PhotoMemo({
        title, memo, uid, createdBy, imageName, imageURL,imageClasses, timestamp, sharedWith,
    });

    try {
        const docId = await addPhotoMemo(photoMemo);
        photoMemo.set_docID(docId);

    } catch (error) {
        console.log('Failed to save photomemo', error);
        alert('Failed to save photomemo ' + JSON.stringify(error));
        e.submitter.innerHTML = buttonLabel;
        e.submitter.disabled = false;
        return;
    }


    imageFile = null;
    e.target.reset();
    const imgTag = document.getElementById('img-tag');
    imgTag.removeAttribute('src');
    const divCreateButton = document.querySelector('#div-create-button');
    const divCreateForm = document.querySelector('#div-create-form');
    divCreateButton.classList.replace('d-none', 'd-block');
    divCreateForm.classList.replace('d-block', 'd-none');


    e.submitter.innerHTML = buttonLabel;
    e.submitter.disabled = false;

    prependPhotoMemoList(photoMemo);
    homePageView();
}

export async function onChangeImageFile(e) {
    imageFile = e.target.files[0];
    const imgElement = document.querySelector('#img-tag');
    if (!imageFile) {
        imgElement.removeAttribute('src');
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = function () {
        imgElement.src = reader.result;
    }
}

export async function onSubmitSearchForm(e){
    e.preventDefault();
    let searchKeys=e.target.searchKeys.value.toLowerCase();
    searchKeys = searchKeys.split(/[ |,|;|\t]+/);
    let results;
    try {
        results=await searchImageByClassName(currentUser.uid, searchKeys);
    } catch (e) {
        console.log('Search failed', e);
        alert('Search failed: ' +JSON.stringify(e));
        return;
    }
}

export function onMouseOverCardView (e, cardView){
    cardView.classList.add('bg-info')
}

export function onMouseOutCardView (e, cardView){
    cardView.classList.remove('bg-info')
}

export function onClickCardView(e, cardView, photoMemo){
    const formEdit=document.getElementById('form-edit');
    const img = formEdit.querySelector('img');
    img.src=photoMemo.imageURL;
    formEdit.title.value=photoMemo.title;
    formEdit.memo.value=photoMemo.memo;
    formEdit.sharedWith.value=photoMemo.sharedWith.join('; ');
    formEdit.onclick=onClickEditForm2ValidateSharedWith;
    formEdit.onsubmit=e=>onSubmitEditForm(e,cardView, photoMemo);
    editOverlayModal.show();
}

export function onClickEditForm2ValidateSharedWith(e) {
    const sharedWithInput = document.getElementById('edit-shared-with');
    const validity=PhotoMemo.validateSharedWith(sharedWithInput.value);
    if(validity==''){
        sharedWithInput.setCustomValidity('');
    } else {
        sharedWithInput.setCustomValidity('Unacceptable: '+validity);
    }
    
}

async function onSubmitEditForm(e, cardView, photoMemo){
    e.preventDefault();
    if(e.submitter.value=='cancel'){
        editOverlayModal.hide();
        return;
    } else if (e.submitter.value=='delete'){
        const r=confirm('Are you sure you want to delete permanently?');
        if (!r) return;
        try{
            await deletePhotoMemo(photoMemo.docId);
            await deleteImage(photoMemo.imageName);
            removeFromPhotoMemoList(photoMemo);
            homePageView();
        } catch {
            console.log('Failed to delete', e);
            alert('Failed to delete: ' +JSON.stringify(e));
        }
        editOverlayModal.hide();
        return;
    }

    const emailList=e.target.sharedWith.value.trim();
    let sharedWith;
    if (emailList.length ==0){
        sharedWith=[];
    } else {
        sharedWith=emailList.split(/[ |,|;]+/);
    }

    const update={
        title: e.target.title.value,
        memo: e.target.memo.value,
        timestamp: Date.now(),
        sharedWith,
    };

    try{
        await updatePhotoMemo(photoMemo.docId, update);
        editOverlayModal.hide();
        photoMemo.title=update.title;
        photoMemo.memo=update.memo;
        photoMemo.timestamp=update.timestamp;
        photoMemo.sharedWith=update.sharedWith;
        reorderPhotoMemoList();
        homePageView();
    } catch(e){
        editOverlayModal.hide();
        console.log('Update error: ', e);
        alert('Update failed: ' + JSON.stringify(e));
    }
}
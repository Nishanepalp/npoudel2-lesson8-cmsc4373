import { PhotoMemo } from "../model/PhotoMemo.js";
import { homePageView, prependPhotoMemoList } from "../view/home_page.js";
import { uploadImage } from "./cloudstorage_controller.js";
import { currentUser } from "./firebase_auth.js";
import { addPhotoMemo } from "./firestore_controller.js";

let imageFile = null;

export async function onClickCreateButton(e) {
    const divCreateButton = document.querySelector('#div-create-button');
    const divCreateForm = document.querySelector('#div-create-form');
    divCreateButton.classList.replace('d-block', 'd-none');
    divCreateForm.classList.replace('d-none', 'd-block');

}
export function onClickCreateForm2ValidateSharedWith(e) {
    const sharedWithInput = document.getElementById('shared-with');
    const elist = sharedWithInput.value.trim();
    if (elist.length > 0) {
        const emails = elist.split(/[,|;| ]+/);
        for (let i = 0; i < emails.length; i++) {
            if (!(/^[0-9]+@uco\.com/.test(emails[i]))) {
                sharedWithInput.setCustomValidity(`${emails[i]} is not acceptable`);
                return;
            }
        }
        sharedWithInput.setCustomValidity('');
        console.log(emails);
    } else {
        sharedWithInput.setCustomValidity('');
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

    const title = e.target.title.value.trim();
    const memo = e.target.memo.value.trim();
    const uid = currentUser.uid;
    const createdBy = currentUser.email;
    const elist = e.target.sharedWith.value.trim();
    const sharedWith = elist.split(/[,|;| ]+/);
    const timestamp = Date.now();

    const photoMemo = new PhotoMemo({
        title, memo, uid, createdBy, imageName, imageURL, timestamp, sharedWith,
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
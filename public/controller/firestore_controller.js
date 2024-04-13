import { 
    getFirestore, collection, addDoc, query,
    where, orderBy, getDocs,updateDoc, doc, deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"
import { app } from "./firebase_core.js";
import { PhotoMemo } from "../model/PhotoMemo.js";



const PHOTOMEMO_COLL='photomemo_collection';

const db=getFirestore(app);

export async function addPhotoMemo(photoMemo){
    const collRef=collection(db, PHOTOMEMO_COLL);
    const docRef= await addDoc(collRef, photoMemo.toFirestore());
    return docRef.id;
}

export async function getPhotoMemoList(uid){
    let photoMemoList=[];
    const coll=collection(db, PHOTOMEMO_COLL);
    const q=query(coll,
        where('uid', '==', uid),
        orderBy('timestamp', 'desc'),);
    const snapShot=await getDocs(q);
    snapShot.forEach(doc => {
        const p=new PhotoMemo(doc.data());
        p.set_docID(doc.id);
        photoMemoList.push(p);
    });
    return photoMemoList;
}

export async function searchImageByClassName(uid, imageClassList){
    const result=[];
    const q = query(
        collection(db, PHOTOMEMO_COLL),
        where('uid', '==', uid),
        where('imageClasses', 'array-contains-any', imageClassList),
        orderBy('timestamp', 'desc'),
    );
    
    const snapShot=await getDocs(q);
    snapShot.forEach(doc => {
        const p=new PhotoMemo(doc.data());
        p.set_docID(doc.id);
        result.push(p);
    });
    return result;

}
export async function getSharedWithPhotoMemoList(email){
    const sharedList=[];
    const q = query(
        collection(db, PHOTOMEMO_COLL),
        where('sharedWith', 'array-contains', email),
        orderBy('timestamp', 'desc'),
    );
    
    const snapShot=await getDocs(q);
    snapShot.forEach(doc => {
        const p = new PhotoMemo(doc.data());
        p.set_docID(doc.id);
        sharedList.push(p);
    });
    return sharedList;

}

export async function updatePhotoMemo(docId, update){
    const docRef=doc(db, PHOTOMEMO_COLL, docId);
    await updateDoc(docRef, update);
}

export async function deletePhotoMemo(docId){
    const docRef=doc(db, PHOTOMEMO_COLL, docId);
    await deleteDoc(docRef);
}
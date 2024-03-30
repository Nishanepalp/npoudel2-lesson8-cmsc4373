import { 
    getFirestore, collection, addDoc, query,
    where, orderBy, getDocs,
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
    const snaptShot=await getDocs(q);
    snaptShot.forEach(doc => {
        const p=new PhotoMemo(doc.data());
        p.set_docID(doc.id);
        photoMemoList.push(p);
    });
    return photoMemoList;
}
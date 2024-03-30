export class PhotoMemo{
    constructor(data){
        if (!data) return;
        this.title=data.title;
        this.memo=data.memo;
        this.uid=data.uid;
        this.createdBy=data.createdBy;
        this.imageName=data.imageName;
        this.imageURL=data.imageURL;
        this.timestamp=data.timestamp;
        if (!data['sharedWith'])
            this.sharedWith=[];
        else 
            this.sharedWith=[...data.sharedWith];
    }

    set_docID(id){
        this.docId=id;  
    }

    toFirestore(){
        return{
            title: this.title,
            memo: this.memo,
            uid: this.uid,
            createdBy: this.createdBy,
            imageName: this.imageName,
            imageURL: this.imageURL,
            timestamp: this.timestamp,
            sharedWith: this.sharedWith,
        };
    }
}
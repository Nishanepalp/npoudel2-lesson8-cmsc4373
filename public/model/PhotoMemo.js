export class PhotoMemo{
    constructor(data){
        if (!data) return;
        this.title=data.title;
        this.memo=data.memo;
        this.uid=data.uid;
        this.createdBy=data.createdBy;
        this.imageName=data.imageName;
        this.imageURL=data.imageURL;
        this.imageClasses=data.imageClasses;
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
            imageClasses: this.imageClasses,
            timestamp: this.timestamp,
            sharedWith: this.sharedWith,
        };
    }
    
    static validateSharedWith(value){
        const str=value.trim();
        if(str.length==0){
            return '';
        }
        const emails = str.split(/[,|;| ]+/);
        let invalidMessage='';

            for (let i = 0; i < emails.length; i++) {
                if (!(/^[0-9]+@uco\.com/.test(emails[i]))) {
                    invalidMessage += `${emails[i]}`;
                }
            }
            return invalidMessage;
    }
}
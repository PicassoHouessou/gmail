
class AttachmentInfo{
    attachment = null ;
    constructor(attachment) {
        this.attachments = attachment ;
    }
     hasAttachment(){
       return this.attachments.length >= 1  ;
    }

    numberOfAttachment(){
        return this.attachments.length ;
    }

}

export default AttachmentInfo ;



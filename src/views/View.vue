<template>
    <div>
        <TopBar></TopBar>
        <div class="mailbox-area mg-tb-15">
            <div class="container-fluid">
                <div class="row">
                    <Side></Side>
                    <div class="col-md-9 col-md-9 col-sm-9 col-xs-12">
                        <div class="hpanel email-compose mailbox-view mg-b-15">
                            <div class="panel-heading hbuilt">

                                <div class="p-xs h4">
                                    <small class="pull-right">
                                        <small><i> {{ moment().to(+message.internalDate) }}</i></small>
                                    </small> <b>{{ message.headers.subject }}</b>

                                </div>
                            </div>
                            <div class="border-top border-left border-right bg-light">
                                <div class="p-m custom-address-mailbox">

                                    <div>
                                        <span class="font-extra-bold">Subjet: </span> <b>{{
                                            message.headers.subject
                                        }}.</b>
                                    </div>
                                    <div>
                                        <span class="font-extra-bold">Émetteur: </span>
                                        <a href="#">{{ message.headers.from }}</a>
                                    </div>
                                    <div>
                                        <span class="font-extra-bold">Date: </span>
                                        <small>{{ moment(new Date(+message.internalDate)).format('LLL') }}</small>
                                    </div>
                                </div>
                            </div>

                            <div class="panel-body panel-csm">
                                <div id="message-container">
                                    <span v-html="message.textHtml"></span>
                                </div>
                            </div>

                            <div class="border-bottom border-left border-right bg-white mg-tb-15"
                                 v-if="hasAttachment(message.attachments)">
                                <p class="m-b-md">
                                    <span><i class="fa fa-paperclip"></i> {{ message.attachments.length }} fichier{{ message.attachments.length==1 ? '':'s'}} joint{{ message.attachments.length==1 ? '':'s'}} </span>
                                </p>

                                <div>
                                    <div class="row">
                                        <div class="col-sm-3 col-md-3 col-sm-3 col-xs-12"
                                             v-for="attachment in message.attachments" :key="attachment.attachmentId">
                                            <div class="hpanel">
                                                <div class="panel-body file-body incon-ctn-view">
                                                    <i class="fa text-info " :class="getIconForAttachment(attachment.mimeType)"></i>
                                                </div>
                                                <div class="panel-footer">
                                                    <a href="" @click.prevent="getAttachmentFile"
                                                       :data-attachment-message-id="message.id"
                                                       :data-attachment-id="attachment.attachmentId"
                                                       :data-attachment-size="attachment.size"
                                                       :data-attachment-mime-type="attachment.mimeType">{{
                                                            attachment.filename
                                                        }}</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div class="panel-footer text-right">
                                <div class="btn-group">
                                    <button class="btn btn-default"><i class="fa fa-reply"></i> Répondre</button>
                                    <button class="btn btn-default"><i class="fa fa-arrow-right"></i> Transférer
                                    </button>
                                    <button class="btn btn-default" @click.prevent="printAsPdf"><i class="fa fa-print"></i> Imprimer</button>
                                    <button class="btn btn-default" @click.prevent="deleteMessage"><i
                                        class="fa fa-trash-o"></i> Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import moment from "moment" ;
import TopBar from "../components/TopBar";
import Side from "../components/Side" ;
import Footer from "../components/Footer";
const { jsPDF } = require("jspdf"); // will automatically load the node version
const html2pdf = require("html2pdf.js") ;
import html2PDF from 'jspdf-html2canvas';
moment.locale('fr');
var parseMessage = require('gmail-api-parse-message');
export default {
    name: 'Home',
    data() {
        return {
            moment,
            message: {
                id: '{MESSAGE_ID}',
                threadId: '{THREAD_ID}',
                labelIds: ['SENT', 'INBOX', 'UNREAD'],
                snippet: 'This is one cool message, buddy.',
                historyId: '701725',
                internalDate: 1451995756000,
                attachments: [{
                    filename: 'example.jpg',
                    mimeType: 'image/jpeg',
                    size: 100446,
                    attachmentId: '{ATTACHMENT_ID}',
                    headers: {
                        'content-type': 'image/jpeg; name="example.jpg"',
                        'content-description': 'example.jpg',
                        'content-transfer-encoding': 'base64',
                        'content-id': '...'
                    }
                }],
                inline: [{
                    filename: 'example.png',
                    mimeType: 'image/png',
                    size: 5551,
                    attachmentId: '{ATTACHMENT_ID}',
                    headers: {
                        'content-type': 'image/jpeg; name="example.png"',
                        'content-description': 'example.png',
                        'content-transfer-encoding': 'base64',
                        'content-id': '...'
                    }
                }],
                headers: {
                    subject: 'Example subject',
                    from: 'Example Name <example@gmail.com>',
                    to: '<foo@gmail.com>, Foo Bar <fooBar@gmail.com>'
                },
                textPlain: 'This is one cool *message*, buddy.\r\n',
                textHtml: '<div dir="ltr">This is one cool <b>message</b>, buddy.</div>\r\n'
            }
        }
    },
    props: ['messageId'],
    components: {
        TopBar,
        Side,
        Footer
    },
    mounted() {
        this.showMessage();
    },
    methods: {
        printAsPdf(){
            const message = document.querySelector('#message-container') ;
            const doc = new jsPDF();

            doc.html(message,{
                callback: function (doc) {
                    doc.save("Message.pdf"); // will save the file in the current working directory
                },
                x: 10,
                y: 10
            }) ;

            // This will implicitly create the canvas and PDF objects before saving.
            html2pdf().from(message).save();
            html2PDF(message, {
                jsPDF: {
                    format: 'a4',
                },
                imageType: 'image/jpeg',
                output: './pdf/generate.pdf'
            });

        },
        getIconForAttachment(mime=''){
            const mimeBase = mime.split('/')[0] ;
            if (mime === 'application/pdf'){
                return 'fa-file-pdf-o' ;
            }
            else if ( mime === 'application/msword' || mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ){
                return 'fa-file-word-o' ;

            }
            else if ( mime === 'application/vnd.ms-excel' || mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
                return 'fa-file-excel-o' ;

            }
            else if ( mime === 'application/vnd.ms-powerpoint' || mime === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'){
                return 'fa-file-powerpoint-o' ;
            }
            else if ( mime === 'application/zip' ||  mime === 'application/tar' || mime === 'application/gzip' || mime === 'application/application/vnd.rar'){
                return 'fa-file-archive-o' ;
            }

            else if ( mimeBase=== 'image'){
                return 'fa-file-image-o' ;

            }
            else if (mimeBase === 'audio')
            {
                return 'fa-file-audio-o' ;
            } else if (mimeBase === 'video'){
                return 'fa-file-video-o'
            }
            else {
                return 'fa-file-o' ;
            }
        },
        base64ToBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || ''
            sliceSize = sliceSize || 512

            const byteCharacters = atob(b64Data)
            const byteArrays = []

            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                const slice = byteCharacters.slice(offset, offset + sliceSize)

                const byteNumbers = new Array(slice.length)
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i)
                }

                const byteArray = new Uint8Array(byteNumbers)

                byteArrays.push(byteArray)
            }

            const blob = new Blob(byteArrays, {type: contentType})
            return blob
        },
        getAttachmentFile(event) {
            let current = event.currentTarget;
            let messageId = current.getAttribute('data-attachment-message-id');
            let attachmentId = current.getAttribute('data-attachment-id');
            // eslint-disable-next-line no-unused-vars


            // eslint-disable-next-line no-undef
            gapi.client.gmail.users.messages.attachments.get({
                userId: 'me',
                messageId: messageId,
                id: attachmentId
            }).then((response) => {
                let result = response.result;
                let attachmentMimeType = current.getAttribute('data-attachment-mime-type');
                let attachmentSize= current.getAttribute('data-attachment-size');

                console.log(attachmentSize);
                let dataBase64Rep = result.data.replace(/-/g, '+').replace(/_/g, '/') ;
                console.log(result.size) ;
               const blob = this.base64ToBlob(dataBase64Rep, attachmentMimeType, +result.size)
                //const blob =new Blob([result.data], {type: attachmentMimeType});
                //new Blob([result.data], {type: attachmentMimeType});
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = current.textContent;
                link.click();
                URL.revokeObjectURL(link.href);
                console.log(result);
            }).catch(err => console.log(err));

        },
        /**
         *  Pour verifier s'il a de pieces jointe
         @param {array} représente un tableau de pieces jointes
         */
        hasAttachment(attachment) {
            return (typeof attachment !== 'undefined') ? Array.isArray(attachment) : false;
        },

        deleteMessage() {
            if (this.message.labelIds.some(element => element == 'TRASH')) {
                this.deleteMessagePermanently();
                return;
            }
            // eslint-disable-next-line no-undef
            gapi.client.gmail.users.messages.trash({
                userId: 'me',
                id: this.message.id
            }).then((response) => {
                console.log(response.result);

            }).catch(err => console.log(err));
        },
        deleteMessagePermanently() {
            // eslint-disable-next-line no-undef
            gapi.client.gmail.users.messages.delete({
                userId: 'me',
                id: this.message.id
            }).then((response) => {
                console.log(response.result);

            }).catch(err => console.log(err));

        },
        showMessage() {
            //let messageId = event.target.getAttribute('data-message-id');
            //let messageId = event.target.getAttribute('data-message-id');
            // eslint-disable-next-line no-undef
            gapi.client.gmail.users.messages.get({
                userId: 'me',
                id: this.messageId
            }).then((response) => {
                var parsedMessage = parseMessage(response.result);
                console.log(parsedMessage);
                // eslint-disable-next-line no-undef
                gapi.client.gmail.users.messages.modify({
                    userId: 'me',
                    id: parsedMessage.id,
                    removeLabelIds: [
                        "UNREAD"
                    ]
                }).then(response => console.log(response)).catch(err => console.log(err));
                //if parsedMessage.labelIds.some()
                this.message = null;
                this.message = new Object(parsedMessage);

            }).catch(err => console.log(err));
        }

    }
}

</script>
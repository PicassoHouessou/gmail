<template>
    <div>
        <TopBar></TopBar>
        <div class="mailbox-area mg-tb-15">
            <div class="container-fluid">
                <div class="row">
                    <Side></Side>
                    <div class="col-md-9 col-md-9 col-sm-9 col-xs-12 mg-t-15">
                        <SendEmail :form="form"  />
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    </div>
</template>

<script>
//import gapi from './../api'
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TopBar from "../components/TopBar";
import Side from "../components/Side";
import Footer from "../components/Footer";
import SendEmail from "@/components/SendEmail";

export default {
    name: 'Home',
    components: {
        SendEmail,
        TopBar,
        Side,
        Footer
    },
    data() {
        return {
            form: {
                to: '',
                cc: '',
                subject: '',
            },
            user: null,

        }

        /*
         heading: {
                    options: [
                        {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
                        {model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'},
                        {model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'},
                        {model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3'}
                    ]
                }

        ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'Indent','blockQuote', 'undo','redo']
        ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
        { name: "styles", items: ['Bold', 'Italic','Underline', 'Strike', 'Blockquote', '-', 'RemoveFormat', '-', 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Table', 'TextColor']

        */
    },
    mounted() {

    }
    ,
    methods: {
        /**
         * Pour la réception des mail
         *
         */
        flash(type = "success", message = "L'email a été envoyé", title = "Information",) {
            this.$notify({
                group: "app",
                title: title,
                type: type,
                text: message,
                position: "top center",
                width: "50%"
            })
        },

        save() {
            this.sendMail('DRAFT');

        }
        ,
        giveUp() {
            document.querySelector('#composeForm').reset();
            this.$router.push({name: 'Home'});

        }
        ,
        sendMail(label = '') {
            console.log(label);
            // eslint-disable-next-line no-unused-vars
            const message =
                "From: " + this.user.emailAddress + "\r\n" +
                "To: " + this.form.to + "\r\n" +
                "Cc: " + this.form.cc + "\r\n" +
                "Subject: " + this.form.subject + "\r\n\r\n";

            const message2 =
                "From: " + this.user.emailAddress + "\n" +
                "To: " + this.form.to + "\n" +
                "Cc: " + this.form.cc + "\n" +
                "Content-Type: text/html; charset=UTF-8" + "\n" +
                "Subject: " + this.form.subject + "\n\n\n" +
                this.editorData;
            //"This is the plain text body of the message.  Note the blank line between the header information and the body of the message.";

// The body needs to be base64url encoded.
            const encodedMessage = btoa(message2)

            const reallyEncodedMessage = encodedMessage.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

            if (label === "DRAFT") {
                this.$gapi.getGapiClient().then((gapi) => {
                    gapi.client.gmail.users.drafts.create({
                        userId: 'me',
                        message: {
                            labelIds: [
                                label
                            ],
                            payload: {
                                mimeType: 'text/html',
                            },
                            raw: reallyEncodedMessage
                        }

                        // eslint-disable-next-line no-unused-vars
                    }).then((response) => {
                        this.$router.push({name: "Home"});
                        this.flash("success", "L'email a été enregistré");

                    })
                });
            } else {
                this.$gapi.getGapiClient().then((gapi) => {
                    gapi.client.gmail.users.messages.send({
                        userId: 'me',
                        labelIds: [
                            label
                        ],
                        payload: {
                            mimeType: 'text/html',
                        },
                        raw: reallyEncodedMessage
                        // eslint-disable-next-line no-unused-vars
                    }).then((response) => {
                        this.$router.push({name: "Home"});
                        this.flash("success", "L'email a été envoyé");
                    })
                        .catch(err => {
                            this.flash("error", err.message, "L'email n'a pas été envoyé");
                        });
                });
            }

        }
        ,
        submit() {
            this.sendMail();
            /*
            let label = event.currentTarget.getAttribute('data-message-label') ;
            if (typeof label === "undefined") {
                label = "SENT" ;
            }
            */

            // eslint-disable-next-line no-undef
            /*
            gapi.client.gmail.users.messages.send({

                'userId': 'me',
                snippet: this.subject


            }
                ).then((response)=>{

                console.log(response) ;

            }).catch(error=>console.log(error)) ;
            */
        }
    }
}

</script>
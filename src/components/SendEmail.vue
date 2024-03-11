<template>
    <ValidationObserver ref="form" v-slot="{ invalid, handleSubmit, reset }">
        <form action="" method="" @reset.prevent="reset" @submit.prevent="handleSubmit(submit)" id="composeForm">
            <div class=" hpanel email-compose mg-b-15 border-rounded
        ">
                <div class="panel-heading hbuilt">
                    <div class="p-xs h4">
                        Nouveau message
                    </div>
                </div>
                <div class="panel-heading hbuilt">
                    <div class="p-xs">
                        <div class="form-horizontal">
                            <div class="form-group">
                                <label class="col-sm-1 control-label text-left">A:</label>
                                <div class="col-sm-11">
                                    <ValidationProvider v-slot="{ errors }">
                                        <input type="text" name="to" class="form-control input-sm"
                                               placeholder="example@email.com" v-model="form.to"
                                               :class="{'input-error': errors[0] }">
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </ValidationProvider>

                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-1 control-label text-left">Cc:</label>
                                <div class="col-sm-11">

                                    <ValidationProvider v-slot="{ errors }">
                                        <input type="text" name="cc" class="form-control input-sm" v-model="form.cc"
                                               :class="{'input-error': errors[0] }">
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </ValidationProvider>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-1 control-label text-left">Suject:</label>
                                <div class="col-sm-11">
                                    <ValidationProvider rules="required" v-slot="{ errors }">
                                        <input type="text" class="form-control input-sm" name="subject"
                                               placeholder="Entrez le sujet de votre message"
                                               v-model="form.subject" :class="{'input-error': errors[0] }">
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </ValidationProvider>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel-body no-padding">

                    <ValidationProvider rules="required" v-slot="{ errors }">
                        <ckeditor name="message" :editor="editor" v-model="editorData" :config="editorConfig"
                                  :class="{'input-error': errors[0] }"></ckeditor>
                        <span class="validation-error"> {{ errors[0] }}</span>
                    </ValidationProvider>
                </div>

                <div class="panel-footer">
                    <div class="pull-right">
                        <div class="btn-group">
                            <button class="btn btn-default" @click.prevent="save"
                                    data-message-label="DRAFT"><i class="fa fa-edit"></i>
                                Enregistrer
                            </button>
                            <button class="btn btn-default" @click.prevent="giveUp"><i
                                class="fa fa-trash"></i>
                                Abandonner
                            </button>
                        </div>
                    </div>
                    <button class="btn btn-primary ft-compse" type="submit">Envoyer</button>
                    <!--            <button class="btn btn-primary ft-compse" @click.prevent="submit" type="submit">Envoyer</button>-->
                    <div class="btn-group">

                        <input type="file" ref="file" id="attachmentFile" @change="handleAttachment"
                               multiple="multiple">
                        <label class="btn btn-default" for="attachmentFile"><i class="fa fa-paperclip"></i></label>
                        <!--                <button class="btn btn-default" @click.prevent="addFile"><i class="fa fa-paperclip"></i></button>-->
                    </div>

                </div>
            </div>

        </form>
    </ValidationObserver>
</template>
<style lang="scss" scoped>
.input-error {
    border: solid 2px red !important;
    margin-bottom: 5px;
}

#attachmentFile {
    display: none;
}

.validation-error {
    color: #dc3545;
}</style>
<script>
import {ValidationObserver, ValidationProvider, extend} from "vee-validate";
import CKEditor from '@ckeditor/ckeditor5-vue2';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import {required, email} from 'vee-validate/dist/rules';

extend('required', {
    ...required,
    message: 'Please enter your {_field_} '
});
extend('email', {
    ...email,
    message: 'Please enter a email'
});
export default {
    name: 'SendEmail',
    components: {
        ckeditor: CKEditor.component,
        ValidationObserver,
        ValidationProvider,
    },
    props: {
        form: {},
    },
    mounted() {
        this.getUserInfo();
    },
    data() {
        return {

            user: null,
            editor: ClassicEditor,
            editorData: '<p>Content of the editor.</p>',
            editorConfig: {
                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'Indent', 'Outdent', 'blockQuote', 'MediaEmbed', 'undo', 'redo'],
                heading: {
                    options: [
                        {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
                        {model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'},
                        {model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'},
                        {model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3'}
                    ]
                }
            }
        }
    },
    methods: {
        getUserInfo() {
            this.$gapi.getGapiClient().then((gapi) => {
                gapi.client.gmail.users.getProfile({
                    userId: 'me'
                }).then((response) => {
                    this.user = response.result;
                }).catch((err) => {
                    this.flash("error", err.message);
                });
            });
        }
        ,
        handleAttachment() {

        },
        addFile() {
            document.querySelector('#attachmentFile').click();

        },
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

        },

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

        },
        sendMailWithAttachmentSimple(label = '') {
            const file = this.$refs.file.files[0];
            const editorDataEncoded = btoa(this.editorData)

            const reallyEncodedEditorData = editorDataEncoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            // eslint-disable-next-line no-unused-vars
            const size = file.size + reallyEncodedEditorData.length
            const message2 =
                "Content-Type:  multipart/related ;  boundary=foo_bar_baz" + "\n" +
                "MIME-Version: 1.0" + "\n"+
                "From: " + this.user.emailAddress + "\n" +
                "To: " + this.form.to + "\n" +
                //"Cc: " + this.form.cc + "\n" +
                "Subject: " + this.form.subject + "\n\n" +
                //"Content-Length:  " + size + "\n\n" +
                "--foo_bar_baz" + "\n" +
                "Content-Type: text/html" + "\n\n" +

                this.editorData + "\n\n" +

                "--foo_bar_baz" + "\n" +
                "Content-Type: " + file.type + ";name=\"" + file.name + "\"\n" +
                'Content-Transfer-Encoding: base64' + "\n" +
                "Content-Disposition: attachment; filename=\"" + file.name + "\"\n\n" +

                //btoa(file) + "\n"+
                btoa(file).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') + "\n\n" +
                "--foo_bar_baz--";

            console.log(message2);
// The body needs to be base64url encoded.
            const encodedMessage = btoa(message2) ;

            //const reallyEncodedMessage = encodedMessage ;
            const reallyEncodedMessage = encodedMessage.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

            if (label === "DRAFT") {
                this.$gapi.getGapiClient().then((gapi) => {
                    gapi.client.gmail.users.drafts.create({
                        userId: 'me',
                        message: {

                            labelIds: [
                                label
                            ],/*,
                            payload: {
                                mimeType: 'text/html',
                            },
                            */
                            raw: reallyEncodedMessage
                        }

                        // eslint-disable-next-line no-unused-vars
                    }).then((response) => {
                        console.log(response);
                        /*
                        this.$router.push({name: "Home"}); */
                        this.flash("success", "L'email a été enregistré");

                    }).catch((err) => {
                        console.log(err);
                        this.flash("error", err.message);
                    })
                });
            } else {
                this.$gapi.getGapiClient().then((gapi) => {
                    gapi.client.gmail.users.messages.send({
                        userId: 'me',
                        /*
                            labelIds: [
                                label
                            ],
                            payload: {
                                mimeType: 'text/html',
                            },
                            */
                        raw: reallyEncodedMessage
                        // eslint-disable-next-line no-unused-vars
                    }).then((response) => {
                        console.log(response)
                        /*
                        this.$router.push({name: "Home"});*/
                        this.flash("success", "L'email a été envoyé");
                    })
                        .catch(err => {
                            console.log(err);
                            this.flash("error", err.message, "L'email n'a pas été envoyé");
                        });
                });
            }

        },
        sendMailWithAttachment(label = '') {
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
                "Content-Type: application/json; charset=UTF-8" + "\n" +
                "X-Upload-Content-Type: message/rfc822" + "\n" +
                "Subject: " + this.form.subject + "\n\n\n" +
                this.editorData;

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
                        uploadType: "resumable",
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

        },
        submit() {
            const file = this.$refs.file.files[0];
            if (!file) {
                this.sendMail();
            } else {
                console.log (file);
                this.sendMailWithAttachmentSimple();
            }

        }
    }

}
</script>
<template>
    <div>
        <TopBar></TopBar>
        <div class="mailbox-area mg-tb-15">
            <div class="container-fluid">
                <div class="row">
                    <Side></Side>
                    <div class="col-md-9 col-md-9 col-sm-9 col-xs-12 mg-t-15">
                        <div class="hpanel email-compose mg-b-15 border-rounded">
                            <div class="panel-heading hbuilt">
                                <div class="p-xs h4">
                                    Nouveau message
                                </div>
                            </div>
                            <div class="panel-heading hbuilt">
                                <div class="p-xs">
                                    <form method="get" class="form-horizontal" id="composeForm">
                                        <div class="form-group">
                                            <label class="col-sm-1 control-label text-left">A:</label>
                                            <div class="col-sm-11">
                                                <input type="text" class="form-control input-sm"
                                                       placeholder="example@email.com" v-model="form.to">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-1 control-label text-left">Cc:</label>
                                            <div class="col-sm-11">
                                                <input type="text" class="form-control input-sm" v-model="form.cc">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-1 control-label text-left">Suject:</label>
                                            <div class="col-sm-11">
                                                <input type="text" class="form-control input-sm"
                                                       placeholder="Entrez le sujet de votre message"
                                                       v-model="form.subject">
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div class="panel-body no-padding">
                                <!-- <div class="summernote6">
                                    <h5>Hello Jonathan! </h5>
                                    <p>Dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the dustrys</strong> standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
                                        a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets
                                        containing Lorem Ipsum passages, and more
                                        <br/>
                                        <br/>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with
                                        a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. recently with.</p>
                                    <p>Mark Smith
                                    </p>
                                </div> -->
                                <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>

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
                                <button class="btn btn-primary ft-compse" @click.prevent="submit">Envoyer</button>
                                <div class="btn-group">
                                    <button class="btn btn-default"><i class="fa fa-paperclip"></i></button>
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
//import gapi from './../api'
import CKEditor from '@ckeditor/ckeditor5-vue2';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TopBar from "../components/TopBar";
import Side from "../components/Side" ;
import Footer from "../components/Footer";
export default {
    name: 'Home',
    components: {
        TopBar,
        Side,
        Footer,
        ckeditor: CKEditor.component
    },
    data() {
        return {
            form: {
                to: '',
                cc: '',
                subject: '',
            },
            user: null,
            editor: ClassicEditor,
            editorData: '<p>Content of the editor.</p>',
            editorConfig: {
                toolbar:  ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'Indent','Outdent','blockQuote','MediaEmbed','undo','redo'],
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
        // eslint-disable-next-line no-undef
        if (typeof gapi.client === "undefined") {
            setTimeout(() => {
                this.getUserInfo()
            }, 15000);
        } else {
            this.getUserInfo();

        }


    }
    ,
    methods: {
        getUserInfo() {
            // eslint-disable-next-line no-undef
            gapi.client.gmail.users.getProfile({
                userId: 'me'
            }).then((response) => {
                this.user = response.result;
            }).catch(err => console.log(err));
        }
        ,
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
                // eslint-disable-next-line no-undef
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

                }).then((response) => {
                    console.log(response.result)
                })
            } else {
                // eslint-disable-next-line no-undef
                gapi.client.gmail.users.messages.send({
                    userId: 'me',
                    labelIds: [
                        label
                    ],
                    payload: {
                        mimeType: 'text/html',
                    },
                    raw: reallyEncodedMessage
                    // raw: encodedMessage
                    // raw: message

                }).then((response) => {
                    console.log(response.result)
                })
                    .catch(err => console.log(err));
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
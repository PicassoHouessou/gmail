<template>
    <div>
        <TopBar></TopBar>
        <div class="mailbox-area mg-tb-15">
            <div class="container-fluid">
                <div class="row">
                    <SideBar></SideBar>
                    <div class="col-md-9 col-md-9 col-sm-9 col-xs-12">
                        <div class="hpanel email-compose mailbox-view mg-b-15" v-if=" message !== null ">
                            <div class="panel-heading hbuilt">

                                <div class="p-xs h4">
                                    <small class="pull-right">
                                        <small><i> {{ message.internalDate | dateTo }}</i></small>
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
                                        <small>{{ message.internalDate | dateFormat('LLL') }}</small>
                                    </div>
                                </div>
                            </div>

                            <div class="panel-body panel-csm">
                                <div id="message-container">
                                    <div v-html="message.textHtml"></div>
                                  <vue-html2pdf
                                      :show-layout="false"
                                      :float-layout="true"
                                      :enable-download="true"
                                      :preview-modal="false"
                                      :filename="message.headers.subject"
                                      :paginate-elements-by-height="1100"
                                      :pdf-quality="2"
                                      pdf-format="a4"
                                      pdf-orientation="portrait"
                                      pdf-content-width="800px"
                                      :manual-pagination="false"
                                      html-to-pdf-options="{enableLinks:true}"

                                      @progress="onProgress($event)"
                                      @startPagination="startPagination()"
                                      @hasPaginated="hasPaginated()"
                                      @beforeDownload="beforeDownload($event)"
                                      @hasDownloaded="hasDownloaded($event)"
                                      ref="html2Pdf"
                                  >
                                    <section slot="pdf-content">
                                      <div v-html="message.textHtml"></div>
                                  </section>

                                  </vue-html2pdf>
                                </div>
                            </div>

                            <div class="border-bottom border-left border-right bg-white mg-tb-15"
                                 v-if="hasAttachment(message.attachments)">
                                <p class="m-b-md">
                                    <span><i class="fa fa-paperclip"></i> {{
                                            message.attachments.length
                                        }} fichier{{
                                            message.attachments.length == 1 ? '' : 's'
                                        }} joint{{ message.attachments.length == 1 ? '' : 's' }} </span>
                                </p>

                                <div>
                                    <div class="row">
                                        <div class="col-sm-3 col-md-3 col-sm-3 col-xs-12"
                                             v-for="attachment in message.attachments" :key="attachment.attachmentId">
                                            <div class="hpanel">
                                                <div class="panel-body file-body incon-ctn-view">
                                                    <i class="fa text-info "
                                                       :class="getIconForAttachment(attachment.mimeType)"></i>
                                                </div>
                                                <div class="panel-footer">
                                                  <a href="" @click.prevent="downloadAttachmentFile"
                                                     :data-attachment-message-id="message.id"
                                                     :data-attachment-id="attachment.attachmentId"
                                                     :data-attachment-size="attachment.size"
                                                     :data-attachment-mime-type="attachment.mimeType">
                                                    {{
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
                                    <button class="btn btn-default" @click.prevent="printAsPdf"><i
                                        class="fa fa-print"></i> Imprimer
                                    </button>
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
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar" ;
import Footer from "../components/Footer";
// Load the full build.
var array = require('lodash/array');
import {mapState} from "vuex" ;
import VueHtml2pdf from 'vue-html2pdf'

//moment.locale('fr');
var parseMessage = require('gmail-api-parse-message');
export default {
    name: 'Home',
    data() {
        return {
            message: null,
            messageId: this.$route.params.messageId|| this.$route.query.messageId || undefined,
        }
    },

    filters: {
        // eslint-disable-next-line no-unused-vars
        dateFormat: function (date, format = 'LL') {
            if (!date) return '';
            //return moment(new Date(+date)).format(format);
            return new Date(+date).toLocaleDateString('fr-fr',
                {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) ;
        },
        dateTo(dateField) {
            if (!dateField) return '';
            return new Date(+dateField).toLocaleDateString('fr-fr',
                {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) ;
            //return dayjs().to(dayjs(+dateField)) ;
            //return moment().to(+dateField);

        }

    },
    computed: {
        ...mapState(['messages'])
    },
    components: {
        TopBar,
        SideBar,
        Footer,VueHtml2pdf
    },
    created() {
        this.showMessage();
    },
    methods: {
        /**
         * Pour imprimer le message au format pdf. Est instable pour le moment
         */
        printAsPdf () {
          this.$refs.html2Pdf.generatePdf()
        },
      onProgress(event){
          console.log(event)

      },
      startPagination(){

      },hasPaginated(){

      },beforeDownload(event){
        console.log(event)
      },
      hasDownloaded(event){
        console.log(event)
      },
      isImage(mime = '') {
        const mimeBase = mime.split('/')[0];
       if (mimeBase === 'image') {
          return true;
        }
       return false;
      },
        /**
         * Retourne la classe font Awesome apprropré en fonction du fichier.
         * @param mime {string} Le mime type du fichier
         */
        getIconForAttachment(mime = '') {
            const mimeBase = mime.split('/')[0];
            if (mime === 'application/pdf') {
                return 'fa-file-pdf-o';
            } else if (mime === 'application/msword' || mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                return 'fa-file-word-o';

            } else if (mime === 'application/vnd.ms-excel' || mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                return 'fa-file-excel-o';

            } else if (mime === 'application/vnd.ms-powerpoint' || mime === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                return 'fa-file-powerpoint-o';
            } else if (mime === 'application/zip' || mime === 'application/tar' || mime === 'application/gzip' || mime === 'application/application/vnd.rar') {
                return 'fa-file-archive-o';
            } else if (mimeBase === 'image') {
                return 'fa-file-image-o';

            } else if (mimeBase === 'audio') {
                return 'fa-file-audio-o';
            } else if (mimeBase === 'video') {
                return 'fa-file-video-o'
            } else {
                return 'fa-file-o';
            }
        },
        /**
         * Convertir une chaine encodée en base 64 en type Blob js . Utile pour le téléchargement de pièces jointes
         * @param b64Data {string} La chaine à convertir qui represente un fichier encodé
         * @param contentType {string} Le type mime du fichier
         * @param sliceSize {integer} La taille du fichier encodé
         *
         */
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
      async getImageData(messageId,attachmentId) {
      const gapi= await this.$gapi.getGapiClient();
        const response = await gapi.client.gmail.users.messages.attachments.get({
          userId: 'me',
          messageId: messageId,
          id: attachmentId
        });

        let result = await response.result.data;
        return result;
        //let dataBase64Rep = result.data.replace(/-/g, '+').replace(/_/g, '/');
      },
      /**
         * Télécharge une pièce jointe
         */
        // eslint-disable-next-line no-unused-vars
        downloadAttachmentFile(event) {
            this.$Progress.start();
            let current = event.currentTarget;
            let messageId = current.getAttribute('data-attachment-message-id');
            let attachmentId = current.getAttribute('data-attachment-id');

            this.$gapi.getGapiClient().then((gapi) => {
                gapi.client.gmail.users.messages.attachments.get({
                    userId: 'me',
                    messageId: messageId,
                    id: attachmentId
                }).then((response) => {
                    let result = response.result;
                    let attachmentMimeType = current.getAttribute('data-attachment-mime-type');
                    //let attachmentSize = current.getAttribute('data-attachment-size');
                    let dataBase64Rep = result.data.replace(/-/g, '+').replace(/_/g, '/');

                    const blob = this.base64ToBlob(dataBase64Rep, attachmentMimeType, +result.size)
                    //const blob =new Blob([result.data], {type: attachmentMimeType});
                    //new Blob([result.data], {type: attachmentMimeType});
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = current.textContent;
                    link.click();
                    URL.revokeObjectURL(link.href);
                    this.$Progress.finish();
                }).catch((err) => {
                    this.$Progress.finish();
                    this.flash("error", err.message);
                });
            });

        },
        /**
         *  Vérifie s'il a de pieces jointes
         * @param attachment {array} représente un tableau de pieces jointes
         * @return boolean
         */
        hasAttachment(attachment) {
            return (typeof attachment !== 'undefined') ? Array.isArray(attachment) : false;
        },
        /**
         * Parcoure le tableau de message et obtient le prochain index du message à afficher.
         * @param currentId {string} L'identifiant du message actuel
         * @param messages {array} Un tableau de message
         */
        showAnotherMessage: function (currentId, messages) {
            messages = messages || this.messages;

            // On affiche automatiquement un autre mail
            let index = array.findIndex(messages, function (o) {
                return o.id == currentId;
            });

            if (index !== -1) {
                let newMessageId = null;
                if (messages.length > 1) {
                    if (messages.length > index) {
                        newMessageId = messages[index + 1].id
                        this.messageId = newMessageId;
                    } else if (messages.length === index) {
                        newMessageId = this.messages[index - 1].id;
                        this.messageId = newMessageId;
                    }
                    // Remove index from messages
                    //messages.splice(index, 1);
                    //On met à jour le data store
                    //this.$store.dispatch('setMessages', messages);
                    this.$store.dispatch('removeMessage', index);

                    // On recharge la page avec le nouveau message
                    this.$router.replace({name: 'Views', query: {messageId: this.messageId}});
                } else {
                    this.$router.push({name: 'Home'});
                }

                //On affiche le nouveau message
                //this.showMessage();
            } else {
                this.$router.push({name: 'Home'});
            }
        },
        /**
         * supprime un message .
         * Essaye d'abord d'envoyer le message dans la corbeille. Si le messsage est déja dans la corbeille fait appel à deleteMessagePermanently pour supprimer définitivement le message
         */
        flash(type = "success", message = "L'email a été envoyé", title = "Information",) {
            this.$notify({
                group: "app",
                title: title,
                type: type,
                text: message,
                duration: 10000,
                position: "top center",
                width: "50%"
            });
        },
        deleteMessage() {
            if (this.message.labelIds.some(element => element == 'TRASH')) {
                this.deleteMessagePermanently();
                return;
            }
            this.$gapi.getGapiClient().then((gapi) => {
                gapi.client.gmail.users.messages.trash({
                    userId: 'me',
                    id: this.message.id
                }).then(() => {
                    // On affiche automatiquement un autre mail
                    this.showAnotherMessage(this.message.id, this.messages);

                }).catch((err) => {
                    this.flash("error", "Erreur : ", err.message);
                });
            });
        },
        /**
         * Supprime définitivement un message
         */
        deleteMessagePermanently() {
            // eslint-disable-next-line no-undef
            this.$gapi.getGapiClient().then((gapi) => {
                gapi.client.gmail.users.messages.delete({
                    userId: 'me',
                    id: this.message.id
                }).then(() => {
                    this.showAnotherMessage(this.message.id, this.messages);
                }).catch((err) => {
                    this.flash("error", "Erreur : ", err.message);
                });

            });
        },
        /**
         * Affiche un message et supprime automatiquement le label UNREAD du message. Autrement dit il marque en meme temps le mail comme lu
         */
        showMessage() {
            if (typeof this.messageId === "undefined") {
                this.$router.push('Home');
            }
            //let messageId = event.target.getAttribute('data-message-id');
            this.$gapi.getGapiClient().then((gapi) => {
                gapi.client.gmail.users.messages.get({
                    userId: 'me',
                    id: this.messageId
                }).then((response) => {
                    const parsedMessage = parseMessage(response.result);
                    gapi.client.gmail.users.messages.modify({
                        userId: 'me',
                        id: parsedMessage.id,
                        removeLabelIds: [
                            "UNREAD"
                        ]
                    }).then().catch(err => console.log(err));
                    //if parsedMessage.labelIds.some()
                    this.message = null;
                    this.message = new Object(parsedMessage);
                }).catch(err => console.log(err));
            });
        }

    }
}

</script>
<template>
    <div class="col-md-3 col-md-3 col-sm-3 col-xs-12 mg-t-15">
        <div class="hpanel responsive-mg-b-30">
            <div class="panel-body">
                <ul class="mailbox-list">
                    <li class="active text-center bg-danger">
                        <router-link :to="{ name: 'Compose' } ">
                            <i class="fa fa-plus-circle"></i> Nouveau message
                        </router-link>
                    </li>
                    <hr>
                    <li v-for="label in labels" :key="label.id" :data-label-id="label.id"
                        @click="getMessageInLabel">
                        <span class="pull-right">{{ label.messagesTotal }}</span>
                         <router-link :to="{name: 'Home', param :{labelId: label.id } }"> <i class="fa " :class="getLabelIcon(label.name)"></i> {{ capitalize(label.name) }}</router-link>
                    </li>
                </ul>
                <hr>
                <ul class="mailbox-list">

                    <li>
                        <a href="#"><i class="fa fa-gears"></i> Paramètres</a>
                    </li>
                    <li>
                        <a href="#"><i class="fa fa-info-circle"></i> Support Technique</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
//import gapi from './../api'
import {mapState} from "vuex" ;
//import moment from "moment";
import AttachmentInfo from "@/Attachment";

var parseMessage = require('gmail-api-parse-message');

export default {
    name: 'Side',
    data() {
        return {
            localTotal: ''
            ,
            //labels: []
        }
    },
    computed: {
        ...mapState(['total', 'labels'])
    },
    mounted() {
        if (this.labels.length < 2){
            this.$store.dispatch('getAllLabels');
            setTimeout(()=>{this.$store.dispatch('getAllLabels');}, 30000) ;
        }

        //this.getAllLabels()
        /*
        setTimeout(
            this.getAllLabels(), 10000
        );
        */

    },
    methods: {
        capitalize(s) {
            if (typeof s !== 'string') return ''
            s = s.toLowerCase();
            return s.charAt(0).toUpperCase() + s.slice(1)
        },
        getLabelIcon(name = '') {
            //let icon = null;
            if (name === 'INBOX') {
                return 'fa-enveloppe';
            } else if (name === 'SENT') {
                return 'fa-enveloppe';
            } else if (name === 'IMPORTANT') {
                return 'fa-enveloppe';
            } else if (name === 'DRAFT') {
                return 'fa-enveloppe';
            } else if (name === 'SPAM') {
                return 'fa-enveloppe';
            } else {
                return 'fa-enveloppe';
            }
            /*
            switch (name) {
              case 'INBOX':
                icon = 'fa-envelope';
                break;
              case 'SENT':
                icon = 'fa-enveloppe'
                break;
              case 'IMPORTANT' :
                icon = 'fa-enveloppe'
                break;
              case 'TRASH' :
                icon = 'trash'
                break;
              case 'DRAFT' :
                icon = 'fa-enveloppe';
                break;
              case 'SPAM' :
                icon = 'fa-enveloppe';
                break;
              default :
                icon = 'fa-enveloppe';
            }
            return icon;
            */
        },
        getMessageInLabel(event) {
            let labelName = event.currentTarget.getAttribute('data-label-id');
            this.$router.push({name: 'Home', params: {labelId: labelName}});


            // eslint-disable-next-line no-undef
            gapi.client.gmail.users.messages.list({
                'userId': 'me',
                'labelIds': labelName
            }).then((response) => {
                    this.localTotal = response.result.resultSizeEstimate;
                    var responses = response.result.messages;
                    let messages = [];
                    if ( typeof  responses !== "undefined") {
                        for (var i = 0; i < responses.length; i++) {
                            // eslint-disable-next-line no-undef
                            gapi.client.gmail.users.messages.get({
                                'userId': 'me',
                                'id': (responses[i]).id
                            }).then((response) => {

                                    let result = parseMessage(response.result);

                                    //let attachmentInfo = null ;
                                    if (typeof result.attachments !== "undefined") {
                                        //attachmentInfo = new AttachmentInfo(result.attachments) ;

                                        Object.defineProperty(result, 'attachmentInfo', new AttachmentInfo(result.attachments));
                                    } else {
                                        //attachmentInfo = new AttachmentInfo([] ) ;

                                        Object.defineProperty(result, 'attachmentInfo', new AttachmentInfo([]));
                                    }


                                    console.log(result.attachmentInfo);
                                    //result.internalDate = moment().to(+result.internalDate);
                                    messages.push(result);
                                }
                            ).catch(err => console.log(err));
                        }
                        this.$store.dispatch('setMessages', messages);
                    }
                }
            ).catch((err) => console.log(err));

        },

        getAllLabels() {
            // eslint-disable-next-line no-undef
            gapi.client.gmail.users.labels.list({
                'userId': 'me'
            }).then((response) => {
                this.labels = response.result.labels;

                //console.log(response.result) ;
            }).catch(err => console.log(err));

            //this.getAllLabels();
        }
        ,
        getAllTotal() {
            let localTotal = {
                draft: null,
                inbox: null,
                junk: null,
                trash: null
            };
            /* eslint-disable no-undef */
            // eslint-disable-next-line no-undef
            gapi.client.gmail.users.drafts.list({
                'userId': 'me'
            }).then((response) => {

                localTotal.draft = response.result.resultSizeEstimate;
            });
            gapi.client.gmail.users.messages.list({
                'userId': 'me'
            }).then((response) => {

                localTotal.inbox = response.result.resultSizeEstimate;
            });


            /*
                        gapi.client.gmail.users.messages.list({
                            'userId': 'me'
                        }).then((response) => {

                            localTotal.inbox = response.result.resultSizeEstimate;
                        }) ;

                        gapi.client.gmail.users.messages.list({
                            'userId': 'me'
                        }).then((response) => {

                            localTotal.inbox = response.result.resultSizeEstimate;
                        }) ;
            */

            this.$store.dispatch('updateTotal', localTotal);
            //context.commit('UPDATE_TOTAL', localTotal);


        }
    }


}
</script>
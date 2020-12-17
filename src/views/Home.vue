<template>
    <div>
        <TopBar></TopBar>
        <div class="mailbox-area mg-tb-15">
            <div class="container-fluid">
                <div class="row">
                    <Side></Side>

                    <div class="col-md-9 col-md-9 col-sm-9 col-xs-12 mg-t-15">
                        <div class="hpanel mg-b-15">
                            <div class="panel-heading hbuilt mailbox-hd">
                                <div class="text-center p-xs font-normal">
                                    <div class="input-group">
                                        <input type="text" class="form-control input-sm"
                                               placeholder="Rechercher dans les messages..." v-model="searchBar.item" @input.prevent="search">
                                        <span class="input-group-btn">
						<button type="button" class="btn btn btn-default">Recherche </button>
					</span>
                                    </div>
                                </div>
                            </div>

                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-md-6 col-md-6 col-sm-6 col-xs-12 mg-b-15">
                                        <div class="btn-group">
                                            <button class="btn btn-default btn-sm" @click.prevent="refreshPage"><i class="fa fa-refresh"></i>
                                                Actualiser
                                            </button>
                                            <button class="btn btn-default btn-sm"><i class="fa fa-trash-o"></i>
                                            </button>
                                            <button class="btn btn-default btn-sm"><i class="fa fa-star-o"></i></button>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-md-6 col-sm-6 col-xs-12 mailbox-pagination mg-b-15">
                                        <label style="margin-right: 10px; font-weight: 400;">{{ total }}</label>
                                        <div class="btn-group">
                                            <button class="btn btn-default btn-sm"><i class="fa fa-arrow-left"></i>
                                            </button>
                                            <button class="btn btn-default btn-sm"><i class="fa fa-arrow-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div class="table-responsive">
                                    <table class="table table-hover table-mailbox">
                                        <tbody>
                                        <tr class="" v-for="message in messages" :class=" isUnread(message.labelIds) ? 'unread' : '' "  v-bind:key="message.id"  :data-message-id="message.id" @click.prevent="showMessage" style="cursor: pointer">
                                            <td class="">
                                                <div class="checkbox checkbox-single checkbox-success">
                                                    <input type="checkbox" checked>
                                                    <label></label>
                                                </div>
                                            </td>
                                            <td><a href="view.php">{{ message.headers.from }}</a></td>
                                            <td><a href="view.php">{{ truncate( message.snippet , 0, 70  )  }}</a>
                                            </td>
                                            <td> <i class="" :class=" hasAttachment(message.attachments) ? 'fa fa-paperclip' : '' " ></i></td>
                                            <td class="text-right mail-date">{{ moment (new Date( +message.internalDate )) .format('LL') }}</td>

                                        </tr>
<!--
                                        <tr>
                                            <td class="">
                                                <div class="checkbox">
                                                    <input type="checkbox">
                                                    <label></label>
                                                </div>
                                            </td>
                                            <td><a href="view.php">Eminem</a></td>
                                            <td><a href="view.php">Praesent nec nisl sed neque ornare maximus at ac
                                                enim.</a>
                                            </td>
                                            <td></td>
                                            <td class="text-right mail-date">14 déc 2020</td>
                                        </tr>

                                        <tr class="unread active">
                                            <td class="">
                                                <div class="checkbox checkbox-single">
                                                    <input type="checkbox" checked>
                                                    <label></label>
                                                </div>
                                            </td>
                                            <td><a href="view.php">Chris Brown</a></td>
                                            <td><a href="view.php">Aenean hendrerit ligula eget augue gravida
                                                semper.</a></td>
                                            <td><i class="fa fa-paperclip"></i></td>
                                            <td class="text-right mail-date">14 déc 2020</td>
                                        </tr>
                                        -->
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            <div class="panel-footer">
                                <i class="fa fa-eye"> </i> 2 messages non lus
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
import TopBar from "../components/TopBar";
import Side from "../components/Side" ;
import Footer from "../components/Footer";
import moment from "moment";
import { mapState } from "vuex" ;
//import AttachmentInfo from "@/Attachment";
moment.locale('fr') ;
var parseMessage = require('gmail-api-parse-message');
export default {
    name: 'Home',
    data(){
      return {
          moment ,
          //messages:[],
          total: '',
          searchBar: {
              item: ''
          }
      }
    },
    props: ['labelId'] ,
    computed : {
        ...mapState(['messages'])
    },
    components: {
        TopBar,
        Side,
        Footer
    }, mounted() {
        //this.inbox();
        /*
        if (this.messages.length <2) {
            this.inbox();
        }
        */

    },
    methods: {
      isUnread(tabs){
      return tabs.some( (element) => element === 'UNREAD' ) ;
      },
        truncate(chaine, offset, length){
            if (typeof length == 'undefined') {
                length = 70 ;
            }
            if (chaine.length< +length){
                return chaine ;
            }else {
                return chaine.substring(offset, length) + '...' ;
            }
        },
        refreshPage(){
            //this.$router.go() ;
            //this.inbox() ;
            //this.$router.push({ name: 'Home'}) ;
        },
        showMessage(event){

            let messageId = event.currentTarget.getAttribute('data-message-id') ;

            console.log(messageId) ;
            this.$router.push({ name: 'Views', params: { messageId }}) ;
        },
      getMessageInLabelInbox() {
        //let labelName = event.currentTarget.getAttribute('data-label-id');
        // eslint-disable-next-line no-undef
        gapi.client.gmail.users.messages.list({
          'userId': 'me',
          'labelIds': 'INBOX'
        }).then((response) => {
              //console.log(response.result) ;
              let responses = response.result.messages;
              let messages = [];
              for (var i = 0; i < responses.length; i++) {
                // eslint-disable-next-line no-undef
                gapi.client.gmail.users.messages.get({
                  'userId': 'me',
                  'id': (responses[i]).id
                }).then((response) => {
                      let result = parseMessage(response.result);

                      result.internalDate = moment().to(+result.internalDate);

                      messages.push(result);
                    }
                ).catch(err => console.log(err));
              }
              this.$store.dispatch('setMessages', messages);
            }
        ).catch((err) => console.log(err));

      },
        hasAttachment(attachment){
          return (typeof  attachment !== 'undefined'  ) ? Array.isArray(attachment) : false ;
        },
      inbox(){
            if (this.labelId.length < 2) {
                this.labelId = 'INBOX' ;
            }
            //document.querySelector('Side').click() ;
            /*
            if (this.labelId.length < 2) {
                this.labelId = 'INBOX' ;
            }
            */
        },

        inboxx() {
            // eslint-disable-next-line no-undef
            gapi.client.gmail.users.messages.list({
                'userId': 'me',
                'labelIds': this.labelId
            }).then((response) => {
                this.total = response.result.resultSizeEstimate ;
                    let responses = response.result.messages;
                    //let result = [] ;
                let messages = [];
                    for (var i = 0; i < responses.length; i++) {
                        // eslint-disable-next-line no-undef
                        gapi.client.gmail.users.messages.get({
                            'userId': 'me',
                            'id': (responses[i]).id
                        }).then((response) => {
                                //let result = response.result;
                                let result = parseMessage(response.result)  ;

                                result.internalDate = moment().to(+result.internalDate);

                            messages.push(result);

                            }
                        ).catch(err => console.log(err));
                    }
                this.$store.dispatch('setMessages', messages);
                }
            ).catch((err) => console.log(err));
        }

    }
}

</script>
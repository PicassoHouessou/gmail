<template>
    <div>
        <TopBar></TopBar>
        <div class="mailbox-area mg-tb-15">
            <div class="container-fluid">
                <div class="row">
                    <SideBar></SideBar>
                    <div class="col-md-9 col-md-9 col-sm-9 col-xs-12 mg-t-15">
                        <div class="hpanel mg-b-15">
                            <div class="panel-heading hbuilt mailbox-hd">
                                <div class="text-center p-xs font-normal">
                                    <div class="input-group">
                                        <input type="text" class="form-control input-sm"
                                               placeholder="Rechercher dans les messages..." v-model="searchBar.item"
                                               @input.prevent="search">
                                        <span class="input-group-btn">
						<button type="button" class="btn btn btn-default">Rechercher</button>
					</span>
                                    </div>
                                </div>
                            </div>

                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-md-6 col-md-6 col-sm-6 col-xs-12 mg-b-15">
                                        <div class="btn-group">
                                            <button class="btn btn-default btn-sm"
                                                    @click.prevent="()=>getMessagesInLabels()"><i
                                                class="fa fa-refresh"></i>
                                                Actualiser
                                            </button>
                                            <button class="btn btn-default btn-sm"><i class="fa fa-trash-o"
                                                                                      @click="deleteMessages"></i>
                                            </button>
                                            <button class="btn btn-default btn-sm"><i class="fa fa-star-o"></i></button>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-md-6 col-sm-6 col-xs-12 mailbox-pagination mg-b-15">
                                        <label style="margin-right: 10px; font-weight: 400;">{{
                                                this.$store.state.messages.length + ' sur ' + totalMessage
                                            }}</label>
                                        <div class="btn-group">
                                            <button class="btn btn-default btn-sm"><i class="fa fa-arrow-left"
                                                                                      @click.prevent="showPreviousPage"></i>
                                            </button>
                                            <button class="btn btn-default btn-sm" v-show="isEndPage===false"
                                                    @click.prevent="showNextPage"><i class="fa fa-arrow-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div class="table-responsive">
                                    <table class="table table-hover table-mailbox">
                                        <tbody>
                                        <tr class="" v-for="message in messages"
                                            :class=" isUnread(message.labelIds) ? 'unread' : '' "
                                            v-bind:key="message.id"
                                            style="cursor: pointer">
                                            <td class="">
                                                <div class="checkbox checkbox-single checkbox-success">
                                                    <input style="margin-left: 5px" type="checkbox"
                                                           :data-message-id="message.id"
                                                           @input="(event)=>onSelectChange(event,message.id)">
                                                    <label></label>
                                                </div>

                                            </td>
                                            <td @click.prevent="(event)=>showMessage(event,message.id)"><a
                                                href="">{{ message.headers.from }}</a>
                                            </td>
                                            <td @click.prevent="(event)=>showMessage(event,message.id)"><a
                                                href="">{{ message.snippet | truncate(50) }}</a>
                                            </td>
                                            <td @click.prevent="(event)=>showMessage(event,message.id)"><i class=""
                                                                                                           :class=" hasAttachment(message.attachments) ? 'fa fa-paperclip' : '' "></i>
                                            </td>
                                            <td @click.prevent="showMessage" :data-message-id="message.id"
                                                class="text-right mail-date">
                                                {{ message.internalDate | dateFormat('LL') }}
                                            </td>

                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            <!--                            <div class="panel-footer">-->
                            <!--                                <i class="fa fa-eye"> </i> 2 messages non lus-->
                            <!--                            </div>-->
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
import SideBar from "../components/SideBar" ;
import Footer from "../components/Footer";
//import moment from "moment";
import {mapState} from "vuex" ;

//.locale('fr');
var array = require("lodash/array");
var parseMessage = require('gmail-api-parse-message');
export default {
    name: 'Home',
    data() {
        return {
            messagesId: [],
            total: '',
            searchBar: {
                item: ''
            },
            pageTokens: [],
            currentPageToken: '',
            isEndPage: false,
        }
    },
    props: ['labelId'],

    computed: {
        ...mapState(['messages', 'totalMessage'])
    },
    components: {
        TopBar,
        SideBar,
        Footer
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
                });

        }

    },
    beforeMount() {
        this.getMessagesInLabels();
    },
    methods: {
        hasPreviousPage() {
        },
        hasNextPage() {

        },
        deleteMessages(type) {
            const messages = this.messagesId;
            if (messages.length == 0) {
                return;
            }
            messages.forEach(async (message) => {
                const gapi = await this.$gapi.getGapiClient();
                if (type == 'TRASH') {
                    await gapi.client.gmail.users.messages.delete({
                        userId: 'me',
                        id: message
                    });
                } else {
                    await gapi.client.gmail.users.messages.trash({
                        userId: 'me',
                        id: message
                    });
                }
            });
            this.messagesId = [];
            this.getMessagesInLabels();
        },
        onSelectChange(event, messageId) {
            const messages = this.messagesId;

            if (event.currentTarget.checked) {
                const exist = messages?.find((element) => element === messageId);
                if (!exist) {
                    messages.push(messageId);
                }

            } else {
                const index = messages?.findIndex((element) => element == messageId);
                if (index != -1) {
                    messages.splice(index, 1);

                }
            }
            this.messagesId = messages;
        },
        showPreviousPage() {

            let index = array.findIndex(this.pageTokens, function (o) {
                return o === this.currentPageToken;
            });
            if (index !== -1) {
                if (index - 1 >= 0) {
                    const tokenToShow = this.pageTokens[index - 1];
                    this.getMessagesInLabels("", tokenToShow);
                }
            }
        },
        showNextPage() {
            let currentPageToken = this.currentPageToken;
            let pageTokens = this.pageTokens;
            let index = array.findIndex(pageTokens, function (o) {
                return o === currentPageToken;
            });

            if (index === -1) {
                this.getMessagesInLabels();
            } else {
                const tokenToShow = this.pageTokens[index + 1];
                this.getMessagesInLabels("", tokenToShow);
            }
        },
        getNextPageMessage() {
            this.$store.dispatch('getAllMessageInLabel');
        },
        isUnread(tabs) {
            return tabs.some((element) => element === 'UNREAD');
        },
        truncate(chaine, offset, length) {
            if (typeof length == 'undefined') {
                length = 70;
            }
            if (chaine.length < +length) {
                return chaine;
            } else {
                return chaine.substring(offset, length) + '...';
            }
        },
        refreshPage() {
            this.$store.dispatch('getAllMessageInLabel', this.labelId);
            //this.$router.go() ;
            //this.inbox() ;
            //this.$router.push({ name: 'Home'}) ;
        },
        showMessage(event, id) {
            let messageId = event.currentTarget.getAttribute('data-message-id');
            this.$router.push({name: 'Views', params: {messageId: id || messageId}});
        },
        getMessagesInLabels(maxResults = "100", nextPageToken = "") {
            //let labelName = event.currentTarget.getAttribute('data-label-id');
            let labelName = this.$route.query.labelId;
            labelName = labelName || 'INBOX';
            this.$gapi.getGapiClient().then((gapi) => {
                this.$store.dispatch('setMessages');
                gapi.client.gmail.users.messages.list({
                    userId: 'me',
                    maxResults: maxResults,
                    pageToken: nextPageToken,
                    labelIds: labelName.toUpperCase()
                }).then((response) => {
                        //On défini le token actuel pour la pagination
                        //this.currentPageToken = nextPageToken;
                        const nextToken = response.result.nextPageToken;
                        if (nextToken) {
                            let previous = this.pageTokens;
                            previous.push(nextToken);
                            this.isEndPage = false;
                            //On s'assure qu'on stocke le token de la page suivante
                            this.nextPageToken = nextToken;
                            this.pageTokens = [...new Set(previous)];
                        } else {
                            this.nextPageToken = null;
                            this.isEndPage = true;
                        }

                        this.$store.commit('SET_TOTAL_MESSAGE', response.result.resultSizeEstimate);
                        //this.$store.commit('SET_NEXT_PAGE_TOKEN', response.result.nextPageToken);
                        let responses = response.result.messages;
                        if (typeof responses !== "undefined") {
                            //this.$store.dispatch('setMessages', []);
                            for (var i = 0; i < responses.length; i++) {
                                // eslint-disable-next-line no-undef
                                gapi.client.gmail.users.messages.get({
                                    'userId': 'me',
                                    'id': (responses[i]).id
                                }).then((response) => {
                                        let result = parseMessage(response.result);
                                        this.$store.dispatch('updateMessage', result);
                                    }
                                ).catch(err => console.log(err));
                            }
                        }
                    }
                ).catch((err) => console.log(err));
            });

        },
        hasAttachment(attachment) {
            return (typeof attachment !== 'undefined') ? Array.isArray(attachment) : false;
        },
        inbox() {
            if (this.labelId.length < 2) {
                this.labelId = 'INBOX';
            }
            //document.querySelector('Side').click() ;
            /*
            if (this.labelId.length < 2) {
                this.labelId = 'INBOX' ;
            }
            */
            let labelName = this.labelId;
            // eslint-disable-next-line no-undef
            gapi.client.gmail.users.messages.list({
                'userId': 'me',
                'labelIds': labelName
            }).then((response) => {
                    this.localTotal = response.result.resultSizeEstimate;
                    var responses = response.result.messages;
                    //let messages = [];
                    if (typeof responses !== "undefined") {

                        this.$store.dispatch('setMessages', []);
                        for (let i = 0; i < responses.length; i++) {
                            // eslint-disable-next-line no-undef
                            gapi.client.gmail.users.messages.get({
                                'userId': 'me',
                                'id': (responses[i]).id
                            }).then((response) => {
                                    let result = parseMessage(response.result);

                                    //messages.push(result);

                                    console.log(result);
                                    //Tres important on met à jour le data store
                                    this.$store.dispatch('pushMessage', result);

                                }
                            ).catch(err => console.log(err));
                        }

                    }
                }
            ).catch((err) => console.log(err));
        },

        inboxx() {
            // eslint-disable-next-line no-undef
            gapi.client.gmail.users.messages.list({
                'userId': 'me',
                'labelIds': this.labelId
            }).then((response) => {
                    this.total = response.result.resultSizeEstimate;
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
                                let result = parseMessage(response.result);

                                //result.internalDate = moment().to(+result.internalDate);

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
import Vue from 'vue'
import Vuex from 'vuex'
//import gapi from './../api'
//var _ = require('lodash');
var array = require('lodash/array');
var parseMessage = require('gmail-api-parse-message');
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        total: {
            draft: null,
            inbox: null,
            junk: null,
            trash: null
        },
        totalMessage: null,
        messages: [],
        labels: [],
        pageTokens: [],
    },
    mutations: {
        SET_NEXT_PAGE_TOKEN(state, pageToken) {
            state.nextPageToken = pageToken;
        },
        SET_TOTAL_MESSAGE(state, totalValue) {
            state.totalMessage = totalValue;
        },
        UPDATE_TOTAL(state, payload) {
            state.total = payload;
        },
        REMOVE_MESSAGE(state, index) {
            let messages = state.messages;
            messages.splice(index, 1);
            // console.log(messages) ;
            state.messages = messages;

        },
        SET_MESSAGES(state, payload) {
            state.messages = payload;
        },
        PUSH_MESSAGE(state, payload) {
            const messages = state.messages
            messages.push(payload);
           // state.messages = [...new Set(messages)]
            state.messages = array.uniqBy(messages, 'id') ;

            //state.messages.push(payload);
        },
        /**
         * Met à jet le tableau de message
         *
         */
        UPDATE_MESSAGE(state, {payload, index}) {

            const messages = state.messages;
            messages[index] = (payload);
            //state.messages = [...new Set(messages)]
            state.messages = array.uniqBy(messages, 'id') ;

            // state.messages[index] = payload;
        },
        GET_ALL_LABELS(state, payload) {
            state.labels = payload;
        },
        PUSH_LABEL(state, payload) {
            const labels = state.labels
            labels.push(payload);
            //state.labels = [...new Set(labels)];
            state.labels = array.uniqBy(labels, 'id') ;
            //state.labels.push(payload);

        },
        SET_LABELS(state, payload) {
            state.labels = payload
        },
        UPDATE_LABEL(state, {payload, index}) {
            const labels = state.labels
            labels[index] = payload;
            //state.labels = [...new Set(labels)];
            state.labels = array.uniqBy(labels, 'id') ;
            //state.labels[index] = payload;
        }
    },
    actions:
        {
            setLabels(context, payload) {
                if (typeof payload === "undefined") {
                    payload = [];
                }
                context.commit('SET_LABELS', payload);
            },
            updateMessage(context, payload) {
                let index = array.findIndex(this.messages, function (o) {
                    return o.id == payload.id;
                });
                if (index === -1) {
                    context.commit('PUSH_MESSAGE', payload);
                } else {
                    context.commit('UPDATE_MESSAGE', {payload, index});
                }
            }
            ,
            updateLabel(context, payload) {
                console.log(payload);
                let index = array.findIndex(this.labels, function (o) {
                    return o.id == payload.id;
                });
                //Si l'élément n'existe pas
                if (index === -1) {
                    context.commit('PUSH_LABEL', payload);
                } else {
                    context.commit('UPDATE_LABEL', {payload, index});
                }
            },
            pushLabel(context, payload) {
                context.commit('PUSH_LABEL', payload);
            }
            ,
            removeMessage(context, index) {
                context.commit('REMOVE_MESSAGE', index);
            }
            ,
            pushMessage(context, message) {
                /*
                if (typeof message === "object" ) {
                    context.commit('PUSH_MESSAGE', message);
                }
                */
                context.commit('PUSH_MESSAGE', message);

            }
            ,
            setMessages(context, messages) {
                if (typeof messages === "undefined") {
                    messages = [];
                }
                context.commit('SET_MESSAGES', messages);
            },
            /*
            removeMessage(context) {
                let  messages = this.messages  ;

                this.setMessages(context, messages) ;
            },*/
            updateTotal(context, total) {
                context.commit('UPDATE_TOTAL', total);
            }
            ,
            getAllLabels(context) {
                this.$gapi.getGapiClient().then((gapi) => {
                    gapi.client.gmail.users.labels.list({
                        'userId': 'me'
                    }).then((response) => {
                        let responses = response.result.labels;
                        context.commit('GET_ALL_LABELS', []);
                        for (var i = 0; i < responses.length; i++) {
                            // eslint-disable-next-line no-undef
                            gapi.client.gmail.users.labels.get({
                                'userId': 'me',
                                'id': (responses[i]).id
                            }).then((response) => {
                                    let result = response.result;
                                    //context.commit('UPDATE_LABEL', result);
                                    context.commit('PUSH_LABEL', result);

                                    //context.dispatch('updateLabel' , result) ;
                                }
                            ).catch(err => console.log(err));
                        }

                    }).catch(err => console.log(err));
                });
            },
            getAllTotal(context) {
                let localTotal = {
                    draft: 0,
                    inbox: 0,
                    junk: 0,
                    trash: 0,
                    spam: 0,

                };

                this.$gapi.getGapiClient().then((gapi) => {
                    gapi.client.gmail.users.messages.list({
                        'userId': 'me'
                    }).then((response) => {
                            let responses = response.result.messages;
                            for (var i = 0; i < responses.length; i++) {
                                gapi.client.gmail.users.messages.get({
                                    'userId': 'me',
                                    'id': (responses[i]).id
                                }).then((response) => {
                                    let result = response.result;
                                    //let result = parseMessage(response.result);

                                    if (result.labelIds.some(element => element == 'INBOX')) {
                                        //console.log(localTotal) ;
                                        localTotal.inbox += 1;
                                    }
                                    if (result.labelIds.some(element => element == 'SPAM')) {
                                        localTotal.spam += 1;
                                    }
                                    if (result.labelIds.some(element => element == 'TRASH')) {
                                        localTotal.trash += 1;
                                    } else if (result.labelIds.some(element => element == 'JUNKS')) {
                                        localTotal.junk += 1;
                                    }

                                }).catch(err => console.log(err));
                            }
                            context.commit('UPDATE_TOTAL', localTotal);
                        }
                    );
                });

            },
            getAllMessageInLabel(context, labelName) {
                labelName = labelName || "INBOX";

                this.$gapi.getGapiClient().then((gapi) => {
                    gapi.client.gmail.users.messages.list({
                        'userId': 'me',
                        'labelIds': labelName
                    }).then((response) => {
                            context.commit('SET_TOTAL_MESSAGE', response.result.resultSizeEstimate);
                            var responses = response.result.messages;
                            //let messages = [];
                            if (typeof responses !== "undefined") {

                                context.commit('SET_MESSAGES', []);
                                for (let i = 0; i < responses.length; i++) {
                                    gapi.client.gmail.users.messages.get({
                                        'userId': 'me',
                                        'id': (responses[i]).id
                                    }).then((response) => {
                                            let result = parseMessage(response.result);

                                            //messages.push(result);
                                            //console.log(result);
                                            //Tres important on met à jour le data store
                                            context.commit('PUSH_MESSAGE', result);

                                        }
                                    ).catch(err => console.log(err));
                                }

                            }
                        }
                    ).catch((err) => console.log(err));

                });

            }
        },
    modules: {}
})

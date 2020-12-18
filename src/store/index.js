import Vue from 'vue'
import Vuex from 'vuex'
import moment from "moment";
//import gapi from './../api'
//import moment from "moment";
var _ = require('lodash');
var parseMessage = require('gmail-api-parse-message');
Vue.use(Vuex)
const CLIENT_ID = '985255929949-3ubo34cfhumtcbj3173ld657sk19nel3.apps.googleusercontent.com';
const API_KEY = 'yKsPbzhhpLv9DJTffaBqRQF-';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
//var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
var SCOPES = 'https://www.googleapis.com/auth/gmail.compose';
export default new Vuex.Store({
    state: {
        CLIENT_ID,
        API_KEY,
        DISCOVERY_DOCS,
        SCOPES,
        total: {
            draft: null,
            inbox: null,
            junk: null,
            trash: null
        },
        totalMessage : null ,
        messages: [],
        labels: []
    },
    mutations: {
        SET_TOTAL_MESSAGE(state, totalValue){
          state.totalMessage = totalValue ;
        },
        UPDATE_TOTAL(state, payload) {
            state.total = payload;
        },
        SET_MESSAGES(state, payload) {
            state.messages = payload;
        },
        PUSH_MESSAGE(state, payload) {
            state.messages.push(payload);
        },
        /**
         * Met à jet le tableau de message
         *
         */
        UPDATE_MESSAGE(state, {payload, index}) {
            state.messages[index] = payload;
        },
        GET_ALL_LABELS(state, payload) {
            state.labels = payload;
        },
        PUSH_LABEL(state, payload) {
            state.labels.push(payload);
        },
        UPDATE_LABEL(state, {payload, index}) {
            console.log(payload);
            console.log(index);
            state.labels[index] = payload;
        }
    },
    actions:
        {
            updateMessage(context, payload) {

                let index = _.findIndex(this.messages, function (o) {
                    return o.id == payload.id;
                });
                if (index !== -1) {
                    console.log(payload);
                    context.commit('PUSH_MESSAGE', payload);
                } else {
                    context.commit('UPDATE_MESSAGE', {payload, index});
                }
            }
            ,
            updateLabel(context, payload) {
                let index = _.findIndex(this.labels, function (o) {
                    return o.id == payload.id;
                });
                if (index !== -1) {
                    console.log(payload);
                    context.commit('PUSH_LABEL', payload);
                } else {
                    context.commit('UPDATE_LABEL', payload);
                }
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
                // eslint-disable-next-line no-undef
                if (typeof gapi.client === 'undefined') {
                    setTimeout(() => {
                        let timer = 5;
                        // eslint-disable-next-line no-undef
                        if (typeof gapi.client.gmail === 'undefined') {
                            timer = 10000
                        }
                        setTimeout(() => {
                            // eslint-disable-next-line no-undef
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
                                            result.internalDate = moment().to(+result.internalDate);
                                            //context.commit('UPDATE_LABEL', result);
                                            context.commit('PUSH_LABEL', result);

                                            //context.dispatch('updateLabel' , result) ;
                                        }
                                    ).catch(err => console.log(err));
                                }

                            }).catch(err => console.log(err));
                        }, timer);
                    }, 10000);
                } else {
                    let timer = 0;
                    // eslint-disable-next-line no-undef
                    if (typeof gapi.client.gmail === 'undefined') {
                        timer = 10000;
                    }
                    setTimeout(() => {
                        // eslint-disable-next-line no-undef
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
                                        result.internalDate = moment().to(+result.internalDate);
                                        context.commit('PUSH_LABEL', result);
                                        //context.dispatch('updateLabel' , result) ;
                                    }
                                ).catch(err => console.log(err));
                            }
                        }).catch(err => console.log(err));
                    }, timer);
                }
            }
            ,
            getAllTotal(context) {
                let localTotal = {
                    draft: 0,
                    inbox: 0,
                    junk: 0,
                    trash: 0,
                    spam: 0,

                };
                /* eslint-disable no-undef */
                // eslint-disable-next-line no-undef
                /*
                gapi.client.gmail.users.drafts.list({
                    'userId': 'me'
                }).then((response) => {

                    localTotal.draft = response.result.resultSizeEstimate;

                    context.commit('UPDATE_TOTAL', localTotal);
                }) ;
                */
                gapi.client.gmail.users.messages.list({
                    'userId': 'me'
                }).then((response) => {
                        let responses = response.result.messages;

                        for (var i = 0; i < responses.length; i++) {
                            // eslint-disable-next-line no-undef
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

                //context.commit('UPDATE_TOTAL', localTotal);
            }
            ,
            getAllMessageInLabel(context, labelName) {
                labelName = labelName || "INBOX";
                let timer = 0;
                if (typeof gapi.client.gmail === "undefined") {
                    timer = 10000;
                }
                setTimeout(() => {
                        // eslint-disable-next-line no-undef
                        gapi.client.gmail.users.messages.list({
                            'userId': 'me',
                            'labelIds': labelName
                        }).then((response) => {
                                context.commit('SET_TOTAL_MESSAGE' , response.result.resultSizeEstimate );
                                var responses = response.result.messages;
                                //let messages = [];
                                if (typeof responses !== "undefined") {

                                    context.commit('SET_MESSAGES', []);
                                    for (let i = 0; i < responses.length; i++) {
                                        // eslint-disable-next-line no-undef
                                        gapi.client.gmail.users.messages.get({
                                            'userId': 'me',
                                            'id': (responses[i]).id
                                        }).then((response) => {
                                                let result = parseMessage(response.result);

                                                //messages.push(result);

                                                //console.log(result);
                                                //Tres important on met à jour le data store
                                                context.commit('UPDATE_MESSAGE', result);

                                            }
                                        ).catch(err => console.log(err));
                                    }

                                }
                            }
                        ).catch((err) => console.log(err));
                    },
                    timer
                );

            }
        }
    ,
    modules: {}
})

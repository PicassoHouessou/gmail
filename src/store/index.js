import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const CLIENT_ID = '985255929949-3ubo34cfhumtcbj3173ld657sk19nel3.apps.googleusercontent.com';
const API_KEY = 'yKsPbzhhpLv9DJTffaBqRQF-';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
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
        }
    },
    mutations: {
        UPDATE_TOTAL(state , payload){
            state.total = payload ;
        }

    },
    actions: {
        updateTotal(context, total){
            context.commit('UPDATE_TOTAL', total);
        },
        getAllTotal(context){
            let localTotal = { draft: null,
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

                context.commit('UPDATE_TOTAL', localTotal);
            }) ;
            gapi.client.gmail.users.messages.list({
                'userId': 'me'
            }).then((response) => {

               localTotal.inbox = response.result.resultSizeEstimate;
                context.commit('UPDATE_TOTAL', localTotal);
            }) ;


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
    },
    modules: {}
})

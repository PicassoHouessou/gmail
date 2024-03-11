import Vue from "vue";
import VueGapi from 'vue-gapi' ;

//import VueGAPI from "vue-gapi";
// Client ID and API key from the Developer Console
const CLIENT_ID = '985255929949-3ubo34cfhumtcbj3173ld657sk19nel3.apps.googleusercontent.com';
const API_KEY = 'yKsPbzhhpLv9DJTffaBqRQF-';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.modify https://mail.google.com/';
// create the 'options' object
const clientConfig = {
    apiKey: API_KEY,
    //clientId: CLIENT_ID + '.apps.googleusercontent.com',
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    // see all available scopes here: https://developers.google.com/identity/protocols/googlescopes'
    scope: SCOPES,
    // works only with `ux_mode: "prompt"`
    refreshToken: true,
}
Vue.use(VueGapi, clientConfig);

//Vue.use(VueGAPI, clientConfig);
export default VueGapi ;
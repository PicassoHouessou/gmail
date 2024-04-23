import Vue from "vue";
import VueGapi from 'vue-gapi' ;

// Client ID and API key from the Developer Console
const CLIENT_ID = process.env.VUE_APP_GMAIL_API_CLIENT;
const API_KEY = process.env.VUE_APP_GMAIL_API_KEY;

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

export default VueGapi;
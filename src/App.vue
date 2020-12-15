<template>
    <div id="app">
        <div id="nav">
        </div>
        <router-view/>
    </div>
</template>

<style lang="scss">
/*@import "https://fonts.googleapis.com/css?family=Roboto:100,300,400,700,900"; */
@import "./assets/css/bootstrap.min.css";
@import "./assets/css/font-awesome.min.css";

@import "./assets/css/main.css";
@import "./assets/css/style.css";
@import "./assets/css/responsive.css";

/*
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
*/
</style>
<script>

// eslint-disable-next-line
//const gapi = require("./http_apis.google.com_js_api");
//var $script = require('scriptjs') ;
//$script("https://apis.google.com/js/api.js", 'gapi') ;
var parseMessage = require('gmail-api-parse-message');
import moment from "moment" ;
//const {google} = require('googleapis');

//import Home from './views/Home.vue'
// Client ID and API key from the Developer Console
const CLIENT_ID = '985255929949-3ubo34cfhumtcbj3173ld657sk19nel3.apps.googleusercontent.com';
const API_KEY = 'yKsPbzhhpLv9DJTffaBqRQF-';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
moment.locale('fr');
import {mapState} from "vuex";

export default {
    name: 'App',
    data() {
        return {
            messages: [],
            buttonConnexion: false,
            total: {
                draft: null,
                inbox: null,
                junk: null,
                trash: null
            }
        }
        //changeConnexionMessage:  (this.buttonConnexion === true) ? 'Déconnexion' : 'Connexion'
    },
    computed: {
        ...mapState(['CLIENT_ID', 'API_KEY', 'DISCOVERY_DOCS', 'SCOPES']),
        changeConnexionMessage: function () {

            return (this.buttonConnexion === true) ? 'Déconnexion' : 'Connexion';
        }
    },
    mounted() {
        this.handleClientLoad();

        // this.updateSigninStatus();
    },
    methods: {
        showMessage(event) {
            let messageId = event.target.getAttribute('data-message-id');
            // eslint-disable-next-line no-undef
            gapi.client.gmail.users.message.get({
                userId: 'me',
                id: messageId
            }).then(function (response) {
                var parsedMessage = parseMessage(response);
                console.log(parsedMessage);
            })
                .catch(err => console.log(err));
        },
        inbox() {
            // eslint-disable-next-line no-undef
            gapi.client.gmail.users.messages.list({
                'userId': 'me'
            }).then((response) => {
                    let responses = response.result.messages;
                    //let result = [] ;

                    this.total.inbox = response.result.resultSizeEstimate;

                    this.$store.dispatch('updateTotal', {
                        inbox: response.result.resultSizeEstimate
                    });
                    for (var i = 0; i < responses.length; i++) {
                        // eslint-disable-next-line no-undef
                        gapi.client.gmail.users.messages.get({
                            'userId': 'me',
                            'id': (responses[i]).id
                        }).then((response) => {
                                let result = response.result;
                                console.log(result.internalDate);
                                console.log(moment().to(+result.internalDate));
                                result.internalDate = moment().to(+result.internalDate);

                                this.messages.push(result);

                            }
                        ).catch(err => console.log(err));
                    }
                }
            ).catch((err) => console.log(err));
        }
        ,
        /**
         *  On load, called to load the auth2 library and API client library.
         */
        handleClientLoad() {
            // eslint-disable-next-line no-undef
            gapi.load('client:auth2', this.initClient);
        }
        ,
        /**
         *  Called when the signed in status changes, to update the UI
         *  appropriately. After a sign-in, the API is called.
         */
        updateSigninStatus(isSignedIn) {
            if (isSignedIn) {
                this.buttonConnexion = true;
                this.inbox();
                this.$store.dispatch('getAllTotal') ;
            } else {
                this.buttonConnexion = false;
            }
        }
        ,
        /**
         *  Initializes the API client library and sets up sign-in state
         *  listeners.
         */
        initClient() {
            let update = this.updateSigninStatus;
            // eslint-disable-next-line no-undef
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            }).then(function () {
                // Listen for sign-in state changes.
                // eslint-disable-next-line no-undef
                gapi.auth2.getAuthInstance().isSignedIn.listen(update());

                // Handle the initial sign-in state.
                // eslint-disable-next-line no-undef
                update(gapi.auth2.getAuthInstance().isSignedIn.get());
            }, function (error) {
                alert(JSON.stringify(error, null, 2));
                //appendPre(JSON.stringify(error, null, 2));
            });
        }
        ,
        /**
         *  Sign in the user upon button click.
         */
        // eslint-disable-next-line
        handleAuthClick(event) {
            // eslint-disable-next-line no-undef
            gapi.auth2.getAuthInstance().signIn();
        }
        ,

        /**
         *  Sign out the user upon button click.
         */
        // eslint-disable-next-line
        handleSignoutClick(event) {
            // eslint-disable-next-line no-undef
            console.log(gapi.auth2.getAuthInstance());
            // eslint-disable-next-line no-undef
            gapi.auth2.getAuthInstance().signOut();
        }
        ,

        changeConnexion(event) {
            //let button = document.getElementById('loginOrlogoutButton');
            if (this.buttonConnexion === true) {

                this.handleSignoutClick(event);
            } else {
                this.handleAuthClick(event);
            }
        }

    }
}


</script>


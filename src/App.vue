<template>
    <div id="app">
        <div id="nav">
        </div>
        <router-view :key="$route.fullPath"/>
        <!-- set progressbar -->
        <vue-progress-bar></vue-progress-bar>
        <notifications group="app"/>
    </div>
</template>

<style lang="scss">
/*@import "https://fonts.googleapis.com/css?family=Roboto:100,300,400,700,900"; */
@import "./assets/css/bootstrap.min.css";
@import "./assets/css/font-awesome.min.css";

@import "./assets/css/main.css";
@import "./assets/css/style.css";
@import "./assets/css/responsive.css";

nav a.router-link-exact-active {
    color: #42b983;
}

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
import moment from "moment" ;
import Offline from "@/components/Offline";

moment.locale('fr');
export default {
    name: 'App',
    data() {
        return {
            messages: [],
        }
    },
    mounted() {
        /*
      this.$modal.show(
          Offline,
          { text: 'Vous etes hors connexion' },
          { clickToClose: false }

      ) */
        // Surveille le mode hors ligne
        //this.onOffline();
        //this.handleClientLoad();

        //  [App.vue specific] When App.vue is finish loading finish the progress bar
        this.$Progress.finish()

        // this.updateSigninStatus();
    },
    created() {
        //  [App.vue specific] When App.vue is first loaded start the progress bar
        this.$Progress.start()
        //  hook the progress bar to start before we move router-view
        this.$router.beforeEach((to, from, next) => {
            //  does the page we want to go to have a meta.progress object
            if (to.meta.progress !== undefined) {
                let meta = to.meta.progress
                // parse meta tags
                this.$Progress.parseMeta(meta)
            }
            //  start the progress bar
            this.$Progress.start()
            //  continue to next page
            next()
        })
        //  hook the progress bar to finish after we've finished moving router-view
        // eslint-disable-next-line no-unused-vars
        this.$router.afterEach((to, from) => {
            //  finish the progress bar
            this.$Progress.finish()
        })

        this.login();
        try {
            // NOTE: Google recommends 45 min refresh policy
            window.setInterval(this.$gapi.refreshToken(), 1000 * 60 * 45);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }


    },
    methods: {
        login() {
            if (!this.$gapi.isAuthenticated()) {
                this.$gapi
                    .login()
                    .then(() => {
                        // eslint-disable-next-line no-console
                        console.log("Successfully authenticated");
                        //this.authenticated = true;
                        //this.userData = this.$gapi.getUserData();
                    })
                    .catch(err => {
                        // eslint-disable-next-line no-console
                        console.error("Login call failed: %s", err.message);
                    });
            }
        },

        onOffline() {
            // addEventListener version
            // eslint-disable-next-line no-unused-vars
            window.addEventListener('offline', (event) => {
                this.$modal.show(
                    Offline,
                    {text: 'Vous etes hors connexion'},
                    {clickToClose: false}
                )
                console.log("You are offline to the network.");
            });
        },
        onError() {
            window.addEventListener("error", function (e) {
                alert("Error occurred: " + e.error.message);
                return false;
            })
        },

    }
}


</script>


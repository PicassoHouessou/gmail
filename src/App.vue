<template>
    <div id="app">
        <div id="nav">
        </div>
        <router-view :key="$route.fullPath"/>
        <vue-progress-bar></vue-progress-bar>
        <notifications group="app"/>
    </div>
</template>

<style lang="scss">
/*@import "https://fonts.googleapis.com/css?family=Roboto:100,300,400,700,900"; */
@import "./assets/css/bootstrap.min.css";
@import "./assets/css/font-awesome.min.css";
//@import "./assets/css/main.css";
@import "./assets/css/style.css";
@import "./assets/css/responsive.css";

nav a.router-link-exact-active {
    color: #42b983;
}


</style>
<script>
import LoginModal from "@/components/LoginModal";

export default {
    name: 'App',
    data() {
        return {
            messages: [],
        }
    },
    beforeMount() {
        //Intercepte toutes les erreurs
        this.onError();
    },
    mounted() {
        this.onError();
        // Surveille le mode hors ligne
        //this.onOffline();
        this.$Progress.finish()
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
        this.$router.afterEach(() => {
            //  finish the progress bar
            this.$Progress.finish()
        })
        this.onError();
        //this.logout();
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
                this.$modal.show(
                    LoginModal,
                    {text: 'Vous devez vous connecter'},
                    {clickToClose: false}
                )
            }
        },


        onOffline() {
            // eslint-disable-next-line no-unused-vars
            window.addEventListener('offline', (event) => {
                this.$notify({
                    group: "app",
                    title: 'Vous etes hors connexion',
                    type: "warn",
                    text: 'Vous etes hors connexion',
                    position: "top center",
                    width: "50%"
                });
                /*
                this.$modal.show(
                    Offline,
                    {text: 'Vous etes hors connexion'},
                    {clickToClose: false}
                )*/
            });
        },
        onError() {
            window.addEventListener("error", function (e) {
                alert("Error occurred: " + e.error.message);
                return false;
            })
        }

    }
}


</script>


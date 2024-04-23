<template>
    <div class="col-md-3 col-md-3 col-sm-3 col-xs-12 mg-t-15">
        <div class="hpanel responsive-mg-b-30">
            <div class="panel-body">
                <ul class="mailbox-list">
                    <li class="active text-center bg-danger">
                        <router-link :to="{ name: 'Compose' } ">
                            <i class="fa fa-plus-circle"></i> Nouveau message
                        </router-link>
                    </li>
                    <hr>
                    <li v-for="label in labels" :key="label.id" :data-label-id="label.id"
                    >
                        <span class="pull-right">{{ label.messagesUnread }}</span>
                        <router-link :to="{name: 'Home', query :{labelId: label.id.toLowerCase() } } "
                                     :data-label-id="label.id"><i class="fa " :class=" getLabelIcon(label.id) "></i>
                            <!--                          :class="  (typeof label.id !== 'undefined' ) ? getLabelIcon(label.id) : '' "-->
                            {{ formatLabel(label.name) }}
                        </router-link>
                    </li>
                </ul>
                <hr>
                <ul class="mailbox-list">

                    <li>
                        <a href="#"><i class="fa fa-gears"></i> Paramètres</a>
                    </li>
                    <li>
                        <a href="#"><i class="fa fa-info-circle"></i> Support Technique</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<style>

li a.router-link-exact-active {
    color: #444444;
    background-color: #f7f9fa;
}
</style>
<script>
import {mapState} from "vuex" ;

export default {
    name: 'SideBar',
    data() {
        return {
            localTotal: ''
            ,
            //labels: []
        }
    },
    callBackFunction: null,
    computed: {
        ...mapState(['total', 'labels'])
    },
    beforeMount() {

        if (this.labels.length < 2) {
            this.getAllLabels();
            /*
            setTimeout(() => {
                this.getAllLabels()
            }, 1000 * 60 * 5);
            */
        }
        //this.getAllMessageInLabel();
        //this.$store.dispatch('getAllLabels') ;
        /*
        if (this.labels.length < 2){
            this.$store.dispatch('getAllLabels');
           this.$store.dispatch('getAllLabels');a
        }
    */
        //this.getAllLabels()


    },
    mounted() {
        this.onError();
    },
    beforeDestroy() {
        clearTimeout(this.$options.callBackFunction);
    },
    methods: {
        onError() {
            window.addEventListener("error", function (e) {
                alert("Error occurred: " + e.error.message);
                return false;
            })
        },
        formatLabel(s) {
            if (typeof s !== 'string') return ''
            return s.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');


        },
        getLabelIcon(name = '') {

            if (name == 'INBOX') {
                return 'fa-envelope';
            } else if (name == 'SENT') {
                return 'fa fa-paper-plane';
            } else if (name == 'IMPORTANT') {
                return 'fa-envelope';
            } else if (name == 'DRAFT') {
                return 'fa-pencil';
            } else if (name == 'SPAM') {
                return 'fa-envelope';
            } else if (name == 'TRASH') {
                return 'fa-trash';
            } else {
                return 'fa-play';
            }

        },
        getAllLabels() {
            this.$gapi.getGapiClient().then((gapi) => {
                gapi.client.gmail.users.labels.list({
                    'userId': 'me'
                }).then((response) => {
                    let responses = response.result.labels;
                    //this.$store.dispatch('setLabels');
                    for (let i = 0; i < responses.length; i++) {
                        gapi.client.gmail.users.labels.get({
                            'userId': 'me',
                            'id': (responses[i]).id
                        }).then((response) => {
                                let result = response.result;
                                //result.internalDate = moment().to(+result.internalDate);
                                this.$store.dispatch('updateLabel', result);
                            }
                        ).catch(err => console.log(err));
                    }
                }).catch(err => console.log(err));
            });

            this.$options.callBackFunction = setTimeout(() => {
                this.getAllLabels();
            }, 1000 * 60);
            //this.getAllLabels() ;
        }
        ,
        getAllTotal() {
            let localTotal = {
                draft: null,
                inbox: null,
                junk: null,
                trash: null
            };
            this.$gapi.getGapiClient().then((gapi) => {
                gapi.client.gmail.users.drafts.list({
                    'userId': 'me'
                }).then((response) => {
                    localTotal.draft = response.result.resultSizeEstimate;
                });
                gapi.client.gmail.users.messages.list({
                    'userId': 'me'
                }).then((response) => {

                    localTotal.inbox = response.result.resultSizeEstimate;
                });
            });


            this.$store.dispatch('updateTotal', localTotal);


        }
    }


}
</script>
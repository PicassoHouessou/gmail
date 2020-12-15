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
                    <li class="active">

                        <router-link :to="{ name: 'Home' } ">
                            <span class="pull-right">{{ total.inbox }}</span>
                            <i class="fa fa-envelope"></i> Boite de Réception
                        </router-link>
                    </li>
                    <li>
                        <span class="pull-right">{{ total.send }}</span>

                        <a href="#"><i class="fa fa-paper-plane"></i> Messages Envoyés</a>
                    </li>
                    <li>
                        <span class="pull-right">{{ total.draft }}</span>
                        <a href="#"><i class="fa fa-pencil"></i> Brouillons</a>
                    </li>
                    <li>
                        <span class="pull-right">{{ total.trash }}</span>
                        <a href="#"><i class="fa fa-trash"></i> Corbeille</a>
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
<script>
import {mapState} from "vuex" ;

export default {
    name: 'Side',
    data(){
        return {
            localTotal :{
                inbox: null ,
                draft: null
            }
        }
    },
    computed: {
        ...mapState(['total'])
    },
    mounted() {

    },
    methods: {
        getAllTotal(){
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
            }) ;
            gapi.client.gmail.users.messages.list({
                'userId': 'me'
            }).then((response) => {

                localTotal.inbox = response.result.resultSizeEstimate;
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

            this.$store.dispatch('updateTotal', localTotal) ;
            //context.commit('UPDATE_TOTAL', localTotal);




        }
    }


}
</script>
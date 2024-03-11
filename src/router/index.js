import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import View from '../views/View.vue'
import Compose from '../views/Compose.vue'

Vue.use(VueRouter)


const progress = {
    func: [
        {call: 'color', modifier: 'temp', argument: '#ff0101'},
        {call: 'fail', modifier: 'temp', argument: '#6e0000'},
        {call: 'location', modifier: 'temp', argument: 'top'},
        {call: 'transition', modifier: 'temp', argument: {speed: '1.5s', opacity: '0.6s', termination: 400}}
    ]
} ;
const routes = [
    {
        path: '/:labelId?',
        name: 'Home',
        component: Home,
        props: true,
        meta:{
            progress
        }
    },
    {
        path: '/views/:messageId?',
        name: 'Views',
        component: View,
        props: true,
        meta:{
            progress
        }
    },
    {
        path: '/compose',
        name: 'Compose',
        component: Compose,
        meta:{
            progress
        }
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior (to) {
        if (to.hash) {
            return {
                selector: to.hash
                // , offset: { x: 0, y: 10 }
            }
        }
        return { x: 0, y: 0 }
    }
})
export default router

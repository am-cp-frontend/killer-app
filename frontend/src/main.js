import Vue from 'vue'
import Vuex from 'vuex'

vue.use(vuex)

import PlayerList from '@/components/PlayerList.vue'


new Vue({
    el: '#app-root',
    render: h => h(PlayerList)
})
/**
 * Created by chengshi on 2017/4/26.
 */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        mall: {
            tabBar: true
        },
        reader: {
            navBar: false,
            tabBar: false
        }
    },
    mutations: {
        updateMallBar(state, tabBar){
            if (tabBar == undefined) {
                state.mall.tabBar = !state.mall.tabBar;
            } else {
                state.mall.tabBar = tabBar;
            }
        },
        updateReaderBar(state, payload){
            if (!payload) {
                state.reader.navBar = !state.reader.navBar;
                state.reader.tabBar = !state.reader.tabBar;
            } else {
                state.reader.navBar = payload.navBar;
                state.reader.tabBar = payload.tabBar;
            }
        }
    }
});

export default store;
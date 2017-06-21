import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        loading: false,
        login: false,
        welcome: false,
        header: {
            title: '首页',
            backText: '',
            showBack: false,
            showSearch: false,
            showShare: false,
            tidyText: '整理'
        },
        reader: {
            header: false,
            tabBar: false
        },
        user: {
            uid: 0,
            egold: 0
        }
    },
    mutations: {
        updateLoading(state, loading){
            state.loading = loading;
        },
        updateLogin(state, login){
            state.login = login;
        },
        updateWelcome(state, welcome){
            state.welcome = welcome;
        },
        updateHeader(state, payload){
            Object.assign(state.header, {
                showBack: false,
                backText: '',
                showSearch: false,
                showShare: false,
                tidyText: '整理'
            }, payload);
        },
        updateReaderBar(state, payload){
            if (!payload) {
                state.reader.header = !state.reader.header;
                state.reader.tabBar = !state.reader.tabBar;
            } else {
                state.reader.header = payload.header;
                state.reader.tabBar = payload.tabBar;
            }
        },
        updateUser(state, payload){
            if (payload) {
                if (payload.uid > 0) {
                    state.user.uid = payload.uid;
                }
                if (payload.egold > 0) {
                    state.user.egold = payload.egold;
                }
            } else {
                state.user.uid = 0;
                state.user.egold = 0;
            }
        }
    }
});

export default store;
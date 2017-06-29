import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        loading: {
            show: false,
            text: '数据加载中，请稍后...'
        },
        header: {
            title: '首页',
            backText: '',
            showBack: false,
            showSearch: false,
            showShare: false,
            showTidy: false,
            showReview: false
        },
        reader: {
            header: false,
            tabBar: false
        },
        user: {
            uid: 0,
            username: '',
            egold: 0
        }
    },
    mutations: {
        updateLoading(state, payload){
            if (payload) {
                state.loading.show = payload.show;
                if (payload.text) {
                    state.loading.text = payload.text;
                }
            }
        },
        updateHeader(state, payload){
            Object.assign(state.header, {
                showBack: false,
                backText: '',
                showSearch: false,
                showShare: false,
                showTidy: false,
                showReview: false
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
                if (payload.username > 0) {
                    state.user.username = payload.username;
                }
                if (payload.egold > 0) {
                    state.user.egold = payload.egold;
                }
            } else {
                state.user.uid = 0;
                state.user.egold = 0
            }
        }
    }
});

export default store;
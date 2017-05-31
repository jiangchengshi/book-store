import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        loading: false,
        header: {
            title: '首页',
            showBack: false,
            backText: '',
            showSearch: false,
            showClean: false
        },
        reader: {
            header: false,
            tabBar: false
        }
    },
    mutations: {
        updateLoading(state, loading){
            state.loading = loading;
        },
        updateHeader(state, payload){
            Object.assign(state.header, {showBack: false, backText: '', showSearch: false, showClean: false}, payload);
        },
        updateReaderBar(state, payload){
            if (!payload) {
                state.reader.header = !state.reader.header;
                state.reader.tabBar = !state.reader.tabBar;
            } else {
                state.reader.header = payload.header;
                state.reader.tabBar = payload.tabBar;
            }
        }
    }
});

export default store;
/**
 * Created by chengshi on 2017/4/26.
 */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        storeUrl: 'http://123.206.191.175:8081/',   // 书城Url
        localPath: '_doc/', // 本地路径
        readerTitle: "阅读器", // 导航页标题
        showHeader: false, // 是否显示导航栏
        showFooter: false, // 是否显示foot栏
        showBtnBack: true, // 是否显示返回按钮
        showBtnMore: true, // 是否显示更多按钮
    },
    mutations: {
        updateTitle (state, title){
            state.readerTitle = title;
        },
        updateNavbarStatus(state, {showHeader, showFooter, showBtnBack = true, showBtnMore = true} = {}){
            if (showHeader == undefined) {
                state.showHeader = !state.showHeader;
            } else {
                state.showHeader = showHeader;
            }
            if (showFooter == undefined) {
                state.showFooter = !state.showFooter;
            } else {
                state.showFooter = showFooter;
            }
            state.showBtnBack = showBtnBack;
            state.showBtnMore = showBtnMore;
        },

    }
});

export default store;
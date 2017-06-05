import Vue from "vue";
// 引入FastClick
import FastClick from "fastclick";
// 引入路由Router
import router from "./router";
// 引入全局变量Vuex
import store from "./store";
// 引入Config
import config from "./config";
// 引入 plusReady
import plusready from "./plus/ready";
// 引入Ajax
import ajax from "./util/ajax";
// 引入Util
import util from "./util/util";
// 引入Log
import log from "./util/log";
// 引入Iconfont字体
import "../css/iconfont.css";
// 引入Vux公共组件引用
import {AjaxPlugin, ToastPlugin} from "vux";
// 主Vue
import App from "../view/App.vue";

// 工具配置
window.app = Object.assign({}, {config, ajax, util, log});

const initVue = function () {
    // 移除移动端点击延迟
    FastClick.attach(document.body);

    // Vux Plugin
    Vue.use(AjaxPlugin);
    Vue.use(ToastPlugin);

    // Vuex加载Loading
    window.app.store = store;

    // Vue实例
    window.app.vue = new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app');
};

let headerHeight = 46, tabbarHeight = 56, searchHeight = 44;
if (navigator.userAgent.indexOf("Html5Plus") < 0) { //不支持5+ API
    Object.assign(config.setting, {
        width: {
            screen: window.screen.availWidth,
            content: window.screen.availWidth - 5
        },
        height: {
            screen: window.screen.availHeight,
            main: window.screen.availHeight - headerHeight - tabbarHeight,
            content: window.screen.availHeight - headerHeight - tabbarHeight + 10,
            search: window.screen.availHeight - searchHeight
        }
    });

    // 初始化Vue
    initVue();
} else { //支持5+ API
    plusready(() => {
        Object.assign(config.setting, {
            isApp: true,
            isAndroid: plus.os.name === "Android",
            isIOS: plus.os.name === "iOS",
            width: {
                screen: plus.screen.resolutionWidth,
                content: plus.screen.resolutionWidth - 10
            },
            height: {
                screen: plus.screen.resolutionHeight,
                main: plus.screen.resolutionHeight - headerHeight - tabbarHeight,
                content: plus.screen.resolutionHeight - headerHeight - tabbarHeight + 10,
                search: plus.screen.resolutionHeight - searchHeight
            }
        });

        // 初始化Vue
        initVue();
    })
}
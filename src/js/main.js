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
// 引入WebSql
import webSql from "./util/websql";
// 引入Log
import log from "./util/log";
// 引入Iconfont字体
import "../css/iconfont.css";
// 引入Vux公共组件
import {AjaxPlugin, ToastPlugin} from "vux";
// 引入Vue-Scroller组件
import VueScroller from "vue-scroller";
// 主Vue
import App from "../view/App.vue";

// 工具配置
window.app = Object.assign({}, {config, ajax, util, webSql, log});

const initVue = function () {
    // 移除移动端点击延迟
    FastClick.attach(document.body);

    // Vux Plugin
    Vue.use(AjaxPlugin);
    Vue.use(ToastPlugin);
    Vue.use(VueScroller);

    // Vuex加载Loading
    window.app.store = store;

    // Vue实例
    window.app.vue = new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app');

    // webSql
    webSql.open();
    // webSql.create("shelf", {
    //     // _id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    //     articleid: 'INTEGER',
    //     articlename: 'TEXT',
    //     cover: 'TEXT',
    //     author: 'TEXT',
    //     time: 'TIMESTAMP'
    // });
    webSql.create("setting", {
        // _id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        key: 'TEXT',
        value: 'TEXT',
        type: 'TEXT'
    });
    webSql.create("chapter", {
        // _id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        id: 'INTEGER',
        articlename: 'TEXT',
        content: 'BLOB',
        mark: 'INTEGER'   // 0-未添加书签；1-已添加书签
    })
};

if (navigator.userAgent.indexOf("Html5Plus") < 0) { //不支持5+ API
    Object.assign(config.setting, {
        width: {
            screen: window.screen.availWidth,
            display: window.screen.availWidth
        },
        height: {
            screen: window.screen.availHeight,
            display: window.screen.availHeight,
            header: 46,
            tabbar: 53,
            searchbar: 44
        }
    });

    // 初始化Vue
    initVue();

    console.log(app.config.setting);
} else { //支持5+ API
    plusready(() => {
        Object.assign(config.setting, {
            isApp: plus.os.name === "Android" || plus.os.name === "iOS",
            platform: plus.os.name,
            width: {
                screen: plus.screen.resolutionWidth,
                display: plus.display.resolutionWidth,
            },
            height: {
                screen: plus.screen.resolutionHeight,
                display: plus.display.resolutionHeight,
                header: 46,
                tabbar: 53,
                searchbar: 44
            }
        });

        // 初始化Vue
        initVue();
    })
}
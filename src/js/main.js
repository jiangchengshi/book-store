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
// 引入Service
import service from "./util/service";
// 引入WebSql
import webSql from "./util/websql";
// 引入Log
import log from "./util/log";
// 引入Iconfont字体
import "../css/iconfont.css";
// 引入Vux公共组件
import {AjaxPlugin, AlertPlugin, ConfirmPlugin, ToastPlugin} from "vux";
// 引入Vue-Scroller组件
import VueScroller from "vue-scroller";
// 主Vue
import App from "../view/App.vue";

// 工具配置
window.app = Object.assign({}, {config, ajax, util, service, webSql, log});

const initVue = function () {
    // 移除移动端点击延迟
    FastClick.attach(document.body);

    // Vux Plugin
    Vue.use(ToastPlugin);
    Vue.use(AlertPlugin);
    Vue.use(ConfirmPlugin);
    Vue.use(AjaxPlugin);
    Vue.use(VueScroller);

    // Vuex加载Loading
    window.app.store = store;

    // Vue实例
    window.app.vue = new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app');
};

const initWebSql = function () {
    // 打开/创建 webSql
    webSql.open();
    webSql.create(app.config.webSql.shelf, { // 书架
        // _id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        articleid: 'INTEGER',
        articlename: 'TEXT',
        cover: 'TEXT',
        author: 'TEXT',
        time: 'TIMESTAMP'
    });
    webSql.create(app.config.webSql.chapter, {  // 章节
        // _id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        articlename: 'TEXT',
        chapterid: 'INTEGER',
        content: 'BLOB'
    });
    webSql.create(app.config.webSql.mark, {  // 书签
        // _id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        chapterid: 'INTEGER',
        translateX: 'INTEGER',
        name: 'TEXT',   // 章节名称
        content: 'TEXT',    // 章节内容
        time: 'TIMESTAMP'
    });
    webSql.create(app.config.webSql.note, {  // 笔记
        // _id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        chapterid: 'INTEGER',
        translateX: 'INTEGER',
        name: 'TEXT',   // 章节名称
        content: 'TEXT',    // 章节内容
        record: 'TEXT', // 笔记记录
        color: 'TEXT',  // 笔记颜色
        time: 'TIMESTAMP'
    });
    webSql.create(app.config.webSql.setting, {  // 设置
        // _id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        key: 'TEXT',
        value: 'TEXT',
        type: 'TEXT'
    });
    webSql.create(app.config.webSql.login, {  // 登录
        uid: 'INTEGER',
        username: 'TEXT',
        egold: 'INTEGER',
        time: 'TIMESTAMP'
    });
    webSql.create(app.config.webSql.updates, {   // 更新
        versioncode: 'INTEGER',
        versionname: 'TEXT',
        content: 'TEXT',
        url: 'TEXT'
    });
};

if (navigator.userAgent.indexOf("Html5Plus") < 0) { //不支持5+ API
    Object.assign(config.setting, {
        platform: navigator.appName,
        network: {
            num: window.navigator.onLine ? 2 : 1,
            txt: window.navigator.onLine ? 'Ethernet' : 'None'
        },
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

    // 初始化WebSql
    initWebSql();

    // 初始化Vue
    initVue();
} else { //支持5+ API
    plusready(() => {
        Object.assign(config.setting, {
            isApp: plus.os.name === "Android" || plus.os.name === "iOS",
            platform: plus.os.name,
            network: {
                num: plus.networkinfo.getCurrentType(),
                txt: networkType[plus.networkinfo.getCurrentType()]
            },
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

        // 初始化WebSql
        initWebSql();

        // 初始化Vue
        initVue();
    })
}

const networkType = {
    0: 'Unknown',
    1: 'None',
    2: 'Ethernet',
    3: 'WiFi',
    4: '2G',
    5: '3G',
    6: '4G'
};
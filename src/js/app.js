import Vue from "vue";
import router from "./router";
import store from "./store";
import scroller from "vue-scroller";

import config from "./config";
import mui from "./lib/mui.min";
import "./lib/velocity.min";

import service from "./util/service";
import ajax from "./util/ajax";
import log from "./util/log";
import util from "./util/util";

import app from "../view/app.vue";

window.app = Object.assign({}, {config, mui, service, ajax, log, util});

const initVue = function () {
    Vue.use(scroller);

    var vueApp = Vue.extend(app);
    window.app.vue = new vueApp({
        router,
        store
    }).$mount('#app');
};

mui.init({
    gestureConfig: {
        tap: true,
        longtap: true,
        swipe: true,
        drag: true
    },
    swipeBack: false, //关闭右滑关闭功能（默认就是false）
    keyEventBind: {
        backbutton: true  //开启back按键监听（默认就是true）
    },
    statusBarBackground: "#1981D8" //设置状态栏颜色,仅iOS可用
});

if (mui.os.plus) {    // 返回是否在基座中运行
    mui.plusReady(function () {
        Object.assign(config.device, {
            isAndroid: plus.os.name === "Android",
            isIOS: plus.os.name === "iOS",
            model: plus.device.model,
            imsi: plus.device.imsi,
            vendor: plus.device.vendor,
            uuid: plus.device.uuid,
            screenHeight: plus.screen.resolutionHeight,
            screenWidth: plus.screen.resolutionWidth,
            displayHeight: plus.display.resolutionHeight,
            displayWidth: plus.display.resolutionWidth,
            scale: plus.screen.scale,
            version: plus.os.version,
            osName: plus.os.name
        });
        config.version = plus.runtime.version;
        config.innerVersion = plus.runtime.innerVersion;
        config.isApp = true;

        // 初始化Vue
        initVue();
    });
} else {
    mui.ready(function () {
        initVue();
    });
}
/**
 * Created by chengshi on 2017/4/26.
 */
import Vue from "vue";
import VueRouter from "vue-router";
// views
import welcome from "../view/welcome.vue";
import shelf from "../view/shelf/index.vue";
import reader from "../view/reader/index.vue";
import store from "../view/store/index.vue";
Vue.use(VueRouter);

const routes = [{
    path: '/',  // 首页
    redirect: '/shelf'
}, {
    path: '/welcome', // 欢迎页
    name: "welcome",
    component: welcome
}, {
    path: '/shelf', // 书架
    name: "shelf",
    component: shelf
}, {
    path: '/reader', // 阅读器
    name: "reader",
    component: reader
}, {
    path: '/store', // 书城
    name: "store",
    component: store
}];

const router = new VueRouter({
    //路由列表
    routes: routes,
    //hash: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器。
    //history: 依赖 HTML5 History API 和服务器配置。查看 HTML5 History 模式.
    //abstract: 支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式。
    mode: 'hash',
    //应用的基路径。例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"。
    base: "/",
    //全局配置 <router-link> 的默认『激活 class 类名』。参考 router-link.
    linkActiveClass: "router-link-active"
});

router.beforeEach((to, from, next) => {
    next();
});
router.afterEach((router) => {
});

export default router;
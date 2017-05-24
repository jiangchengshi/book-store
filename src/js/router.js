/**
 * Created by chengshi on 2017/4/26.
 */
import Vue from "vue";
import VueRouter from "vue-router";
// views
import Welcome from "../view/Welcome.vue";
import Shelf from "../view/shelf/Index.vue";
import Reader from "../view/reader/Index.vue";
import Mall from "../view/mall/Index.vue";
import Search from "../view/mall/Search.vue";
import NewBook from "../view/mall/book/New.vue";
import FreeBook from "../view/mall/book/Free.vue";
import SpecialBook from "../view/mall/book/Special.vue";
import Monthly from "../view/mall/monthly/Index.vue";
import MonthlyDetail from "../view/mall/monthly/Detail.vue";
import MonthlyPackage from "../view/mall/monthly/Package.vue";
import Login from "../view/Login.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',  // 首页
        redirect: '/shelf'
    },
    {
        path: '/welcome', // 欢迎页
        name: "welcome",
        component: Welcome
    },
    {
        path: '/shelf', // 书架
        name: "shelf",
        component: Shelf
    },
    {
        path: '/reader', // 阅读器
        name: "reader",
        component: Reader
    },
    {
        path: '/mall', // 书城
        name: "mall",
        component: Mall
    },
    {
        path: '/search', // 搜索
        name: "search",
        component: Search
    },
    {
        path: '/newBook', // 新书
        name: "newBook",
        component: NewBook
    },
    {
        path: '/freeBook', // 免费
        name: "freeBook",
        component: FreeBook
    },
    {
        path: '/specialBook', // 特价
        name: "specialBook",
        component: SpecialBook
    },
    {
        path: '/monthly', // 包月
        name: "monthly",
        component: Monthly
    },
    {
        path: '/monthlyDetail', // 包月详情
        name: "monthlyDetail",
        component: MonthlyDetail
    },
    {
        path: '/monthlyPackage', // 包月包
        name: "monthlyPackage",
        component: MonthlyPackage
    },
    {
        path: '/login', // 登录
        name: "login",
        component: Login
    }
];

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
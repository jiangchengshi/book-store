import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// Views
const Welcome = resolve => require(['../view/Welcome.vue'], resolve);
const Mall = resolve => require(['../view/mall/Mall.vue'], resolve);
const MallIndex = resolve => require(['../view/mall/Index.vue'], resolve);
const MallBookNew = resolve => require(['../view/mall/book/New.vue'], resolve);
const MallBookFree = resolve => require(['../view/mall/book/Free.vue'], resolve);
const MallBookSpecial = resolve => require(['../view/mall/book/Special.vue'], resolve);
const MallBookDetail = resolve => require(['../view/mall/book/Detail.vue'], resolve);
const MallBookTicket = resolve => require(['../view/mall/book/Ticket.vue'], resolve);
const MallBookFlower = resolve => require(['../view/mall/book/FLower.vue'], resolve);
const MallBookReward = resolve => require(['../view/mall/book/Reward.vue'], resolve);
const MallBookCatalog = resolve => require(['../view/mall/book/Catalog.vue'], resolve);
const MallMonthlyList = resolve => require(['../view/mall/monthly/List.vue'], resolve);
const MallMonthlyDetail = resolve => require(['../view/mall/monthly/Detail.vue'], resolve);
const MallMonthlyPackage = resolve => require(['../view/mall/monthly/Package.vue'], resolve);
const MallClassifyList = resolve => require(['../view/mall/classify/List.vue'], resolve);
const MallClassifyDetail = resolve => require(['../view/mall/classify/Detail.vue'], resolve);
const MallTopicDetail = resolve => require(['../view/mall/topic/Detail.vue'], resolve);
const Recharge = resolve => require(['../view/recharge/Recharge.vue'], resolve);
const Shelf = resolve => require(['../view/shelf/Shelf.vue'], resolve);
const ShelfIndex = resolve => require(['../view/shelf/Index.vue'], resolve);
const Reader = resolve => require(['../view/reader/Reader.vue'], resolve);
const Search = resolve => require(['../view/search/Search.vue'], resolve);
const Mine = resolve => require(['../view/mine/Mine.vue'], resolve);
const MineIndex = resolve => require(['../view/mine/Index.vue'], resolve);
const MineInfo = resolve => require(['../view/mine/Info.vue'], resolve);
const MineAvatar = resolve => require(['../view/mine/Avatar.vue'], resolve);
const MinePassChange = resolve => require(['../view/mine/PassChange.vue'], resolve);
const MineNickName = resolve => require(['../view/mine/NickName.vue'], resolve);
const MineSex = resolve => require(['../view/mine/Sex.vue'], resolve);
const MineRecordRecharge = resolve => require(['../view/mine/record/Recharge.vue'], resolve);
const MineRecordConsume = resolve => require(['../view/mine/record/Consume.vue'], resolve);
const MineRecordReward = resolve => require(['../view/mine/record/Reward.vue'], resolve);
const MineReview = resolve => require(['../view/mine/Review.vue'], resolve);
const MineNews = resolve => require(['../view/mine/News.vue'], resolve);
const Entry = resolve => require(['../view/entry/Entry.vue'], resolve);
const EntryLogin = resolve => require(['../view/entry/Login.vue'], resolve);
const EntryLogon = resolve => require(['../view/entry/Logon.vue'], resolve);
const EntryPassForget = resolve => require(['../view/entry/PassForget.vue'], resolve);
const SystemFeedback = resolve => require(['../view/system/Feedback.vue'], resolve);
const SystemSetting = resolve => require(['../view/system/Setting.vue'], resolve);
const SystemAbout = resolve => require(['../view/system/About.vue'], resolve);
const Test = resolve => require(['../view/Test.vue'], resolve);

// routes
const routes = [
    {
        path: '/welcome',
        component: Welcome,
    },
    {
        path: '/mall',
        component: Mall,
        children: [
            {
                path: 'index',
                component: MallIndex
            },
            {
                path: 'book/new',
                component: MallBookNew
            },
            {
                path: 'book/free',
                component: MallBookFree
            },
            {
                path: 'book/special',
                component: MallBookSpecial
            },
            {
                path: 'book/detail',
                component: MallBookDetail
            },
            {
                path: 'book/ticket',
                component: MallBookTicket
            },
            {
                path: 'book/flower',
                component: MallBookFlower
            },
            {
                path: 'book/reward',
                component: MallBookReward
            },
            {
                path: 'book/catalog',
                component: MallBookCatalog
            },
            {
                path: 'monthly/list',
                component: MallMonthlyList
            },
            {
                path: 'monthly/detail',
                component: MallMonthlyDetail
            },
            {
                path: 'monthly/package',
                component: MallMonthlyPackage
            },
            {
                path: 'classify/list',
                component: MallClassifyList
            },
            {
                path: 'classify/detail',
                component: MallClassifyDetail
            },
            {
                path: 'topic/detail',
                component: MallTopicDetail
            }
        ]
    },
    {
        path: '/shelf',
        component: Shelf,
        children: [
            {
                path: 'index',
                component: ShelfIndex
            }
        ]
    },
    {
        path: '/reader',
        component: Reader
    },
    {
        path: '/search',
        component: Search
    },
    {
        path: '/mine',
        component: Mine,
        children: [
            {
                path: 'index',
                component: MineIndex
            },
            {
                path: 'info',
                component: MineInfo
            },
            {
                path: 'avatar',
                component: MineAvatar
            },
            {
                path: 'password/change',
                component: MinePassChange
            },
            {
                path: 'nickname',
                component: MineNickName
            },
            {
                path: 'sex',
                component: MineSex
            },
            {
                path: 'record/recharge',
                component: MineRecordRecharge
            },
            {
                path: 'record/consume',
                component: MineRecordConsume
            },
            {
                path: 'record/reward',
                component: MineRecordReward
            },
            {
                path: 'review',
                component: MineReview
            },
            {
                path: 'news',
                component: MineNews
            }
        ]
    },
    {
        path: '/entry',
        component: Entry,
        children: [
            {
                path: 'login',
                component: EntryLogin
            },
            {
                path: 'logon',
                component: EntryLogon
            },
            {
                path: 'password/forget',
                component: EntryPassForget
            },
            {
                path: 'logout',
                redirect: '/mall/index'
            }
        ]
    },
    {
        path: '/recharge',
        component: Recharge
    },
    {
        path: '/feedback',
        component: SystemFeedback
    },
    {
        path: '/setting',
        component: SystemSetting
    },
    {
        path: '/about',
        component: SystemAbout
    },
    {
        path: '/test',
        component: Test
    }
];

const vueRouter = new VueRouter({
    routes
});

vueRouter.beforeEach((to, from, next) => {
    // Loading start...
    let text = "页面奔跑中,请稍后...";
    if (!app.service.hasNetwork()) {
        text = "网络连接异常，请确认...";
    }
    app.store.commit('updateLoading', {
        show: true,
        text: text
    });

    switch (to.path) {
        case '/':
            if (app.util.localStorage('welcome') == 1) {    // 非首次进入，跳过欢迎轮播页
                localShelf(function (rows) {
                    if (rows && rows.length > 0) {  // 书架有书籍信息，则跳转书架
                        next('/shelf');
                    } else {  // 反之，则跳转 书城
                        next('/mall');
                    }
                });
            } else {
                next('/welcome');
            }
            break;
        case '/mall':
            next(to.path + '/index');
            break;
        case '/shelf':
        case '/mine':
            checkLogin(function () {
                next(to.path + '/index');
            }, function () {
                next('/entry/login');
            });
            break;
        case '/mall/book/detail':
        case '/mall/monthly/detail':
            checkLogin(function () {
                next();
            }, function () {
                next('/entry/login');
            });
        default:
            next();
    }
});

vueRouter.afterEach((router) => {
    // Loading end...
    let interval = 0;
    if (!app.service.hasNetwork()) {
        interval = 3000;
    }
    setTimeout(function () {
        app.store.commit('updateLoading', {
            show: false
        });
    }, interval);
});

const checkLogin = function (cb_suc, cb_err) {
    if (app.store.state.user.uid <= 0) {   // 登录过，重新打开应用
        app.webSql.query(app.config.webSql.login, {}, {}, (rows) => {
            if (rows && rows.length > 0) {  // 登录过，store赋值
                let row = rows.item(0);
                app.store.commit('updateUser', {
                    uid: row.uid,
                    egold: row.egold
                });

                if (typeof cb_suc == "function") {
                    cb_suc();
                }
            } else {  // 未登录，跳转未登录页面
                if (typeof cb_err == "function") {
                    cb_err();
                }
            }
        });
    } else {  // 已登录，跳转业务页面
        if (typeof cb_suc == "function") {
            cb_suc();
        }
    }
};
const localShelf = function (callback) {
    app.webSql.query(app.config.webSql.shelf, {}, {}, (rows) => {
        if (typeof callback == "function") {
            callback(rows);
        }
    });
};

export default vueRouter;
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// Views
const Mall = resolve => require(['../view/mall/Mall.vue'], resolve);
const MallIndex = resolve => require(['../view/mall/Index.vue'], resolve);
const MallBookNew = resolve => require(['../view/mall/book/New.vue'], resolve);
const MallBookFree = resolve => require(['../view/mall/book/Free.vue'], resolve);
const MallBookSpecial = resolve => require(['../view/mall/book/Special.vue'], resolve);
const MallBookDetail = resolve => require(['../view/mall/book/Detail.vue'], resolve);
const MallBookCatalog = resolve => require(['../view/mall/book/Catalog.vue'], resolve);
const MallMonthlyList = resolve => require(['../view/mall/monthly/List.vue'], resolve);
const MallMonthlyDetail = resolve => require(['../view/mall/monthly/Detail.vue'], resolve);
const MallMonthlyPackage = resolve => require(['../view/mall/monthly/Package.vue'], resolve);
const MallClassifyList = resolve => require(['../view/mall/classify/List.vue'], resolve);
const MallClassifyDetail = resolve => require(['../view/mall/classify/Detail.vue'], resolve);
const MallTopicDetail = resolve => require(['../view/mall/topic/Detail.vue'], resolve);
const Shelf = resolve => require(['../view/shelf/Shelf.vue'], resolve);
const ShelfIndex = resolve => require(['../view/shelf/Index.vue'], resolve);
const Reader = resolve => require(['../view/reader/Reader.vue'], resolve);
const Search = resolve => require(['../view/search/Search.vue'], resolve);
const Mine = resolve => require(['../view/mine/Mine.vue'], resolve);
const MineIndex = resolve => require(['../view/mine/Index.vue'], resolve);
const Sign = resolve => require(['../view/sign/Sign.vue'], resolve);
const SignIn = resolve => require(['../view/sign/In.vue'], resolve);
const SignUp = resolve => require(['../view/sign/Up.vue'], resolve);
const SignPass = resolve => require(['../view/sign/Pass.vue'], resolve);

// routes
const routes = [
    {
        path: '/',
        redirect: '/shelf'
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
            }
        ]
    },
    {
        path: '/sign',
        component: Sign,
        children: [
            {
                path: 'in',
                component: SignIn
            },
            {
                path: 'up',
                component: SignUp
            },
            {
                path: 'pass',
                component: SignPass
            }
        ]
    }
];

const vueRouter = new VueRouter({
    routes
});

vueRouter.beforeEach((to, from, next) => {
    // Loading start...
    app.store.commit('updateLoading', true);

    // 特殊路由跳转处理
    switch (to.path) {
        case '/mall':
            next('/mall/index');
            break;
        case '/shelf':
        case '/mine':
            // 登录检查：获取websql中 uid
            app.webSql.query(app.config.webSql.sign, {}, {}, (rows) => {
                if (rows && rows.length > 0) {
                    let row = rows.item(0);
                    if (new Date().getTime() - new Date(row.time).getTime() < app.config.setting.signTime) {   // 5分钟
                        app.webSql.update(app.config.webSql.sign, {
                            time: new Date()
                        }, {
                            id: row.id
                        }, function () {
                            // 更新 store中 uid
                            app.store.commit('updateUser', {
                                uid: row.id,
                                egold: row.egold
                            });

                            next(to.path + '/index');
                        })
                    } else {
                        app.webSql.delete(app.config.webSql.sign, {
                            id: row.id
                        }, function () {
                            next(to.path + '/index');
                        });
                    }
                } else {
                    next(to.path + '/index');
                }
            });
            break;
    }

    next();
});

vueRouter.afterEach((router) => {
    // Loading end...
    app.store.commit('updateLoading', false);
});

export default vueRouter;
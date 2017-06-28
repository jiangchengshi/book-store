/**
 * Created by chengshi on 2017/4/26.
 */
export default {
    setting: {
        isApp: false,
        platform: 'web',
        network: {
            num: 1,
            txt: 'None'
        },
        width: {
            screen: 0,
            display: 0
        },
        height: {
            screen: 0,
            display: 0
        },
        loginTime: 300000,
        codeTime: 120,
        server: 'http://api.lveshu.com/',
        debug: true
    },
    webSql: {
        shelf: 'shelf',
        chapter: 'chapter',
        setting: 'setting',
        login: 'login',
        mark: 'mark',
        note: 'note'
    },
    api: {
        focus: 'index/focus',
        navigator: 'index/name',
        recommend2: 'index/tuijian',
        recommend: 'index/recommend/',
        book: {
            new: 'news/',
            free: 'free/',
            special: 'special/',
            detail: 'detail/',
            review: {
                list: 'review/',
                detail: 'review/info/',
                add: 'review/add',
                reply: 'review/reply',
            },
            ticket: {
                get: 'vipvote/',
                add: 'vipvote/add'
            },
            flower: {
                get: 'flower/',
                add: 'flower/add'
            },
            reward: {
                get: 'gift/',
                add: 'gift/add'
            }
        },
        monthly: {
            monthly: 'monthly/',
            info: 'monthly/info/',
            buy: 'monthly/buy'
        },
        classify: 'sort/',
        topic: 'topic/',
        search: {
            search: 'search',
            hot: 'search/hot'
        },
        shelf: {
            list: 'bookcase/',
            add: 'bookcase/add',
            delete: 'bookcase/delete'
        },
        chapter: {
            catalog: 'chapters/',
            info: 'chapters/info/',
            buy:'chapters/buy',
            batch: {
                buy: 'chapters/batchbuy',
                option: 'batchbuy/option/',
                price: 'batchbuy/'
            }
        },
        entry: {
            login: 'member/login',
            logon: 'member/register',
            sms: 'sms/',
            password: 'member/find'
        },
        mine: {
            info: 'member/',
            base: 'memberinfo/',
            avatar: 'avatar/',
            nickname: 'nickname/',
            sex: 'sex/',
            password: 'password',
            recharge: 'paylog/',
            consume: 'sale/',
            reward: {
                reward: 'actlog/gift/',
                flower: 'actlog/flower/',
                ticket: 'actlog/vipvote/'
            },
            review: 'review/member/',
            news: 'message/'
        },
        sign: 'signin/',
        setting: {
            feedback: 'message/add'
        },
        recharge:{
            recharge: 'buy/',
            note: 'buy/note'
        }
    }
}
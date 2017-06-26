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
        mark: 'mark'
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
            review: 'review/',
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
        reader: {
            chapters: 'chapters/',
            chapter: 'chapters/info/'
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
            review: 'review/user/',
            news: 'message/'
        },
        review: {
            add: 'review/add',
            info: 'review/info/',
            reply: 'review/reply',
            user: 'review/user/'
        },
        sign: 'signin/',
        setting: {
            feedback: 'message/add'
        },
        buy: {
            chapter: 'chapters/buy',
            chapters: {
                batch: 'chapters/batchbuy',
                option: 'batchbuy/option/',
                price: 'batchbuy/'
            }
        },
        recharge:{
            recharge: 'buy/',
            note: 'buy/note'
        }
    }
}
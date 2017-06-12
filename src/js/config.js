/**
 * Created by chengshi on 2017/4/26.
 */
export default {
    setting: {
        isApp: false,
        platform: 'web',
        width: {
            screen: 0,
            display: 0
        },
        height: {
            screen: 0,
            display: 0
        },
        signTime: 300000,
        codeTime: 120,
        server: 'http://api.lveshu.com/',
        debug: true
    },
    webSql: {
        shelf: 'shelf',
        chapter: 'chapter',
        setting: 'setting',
        sign: 'sign',
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
            review: 'review/'
        },
        monthly: {
            monthly: 'monthly/',
            info: 'monthly/info/'
        },
        classify: 'sort/',
        topic: 'topic/',
        search: {
            search: 'search',
            hot: 'search/hot'
        },
        shelf:{
            list: 'bookcase/',
            add: 'bookcase/add',
            delete: 'bookcase/delete'
        },
        reader: {
            chapters: 'chapters/',
            chapter: 'chapters/info/'
        },
        sign: {
            in: 'member/login',
            up: 'member/register',
            code: 'sms/'
        },
        user:{
            info: 'member/',
            base: 'memberinfo/'
        }
    }
}
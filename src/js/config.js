/**
 * Created by chengshi on 2017/4/26.
 */
export default {
    setting: {
        isApp: false,
        platform: 'web',
        width: {
            screen: 0,
            content: 0
        },
        height: {
            screen: 0,
            main: 0,
            content: 0,
            search: 0
        },
        server: 'http://api.lveshu.com/',
        debug: true
    },
    webSql: {
        chapter: 'chapter',
        setting: 'setting'
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
        reader: {
            chapters: 'chapters/',
            chapter: 'chapters/info/'
        }
    }
}
/**
 * Created by chengshi on 2017/4/26.
 */
export default {
    setting: {
        isApp: false,
        isAndroid: false,
        isIOS: false,
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
        classify: 'sort/',
        monthly: {
            monthly: 'monthly/',
            info: 'monthly/info/'
        },
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
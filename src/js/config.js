/**
 * Created by chengshi on 2017/4/26.
 */
export default {
    setting: {
        isApp: false,
        isAndroid: false,
        isIOS: false,
        width: {
            screen: 0
        },
        height: {
            screen: 0,
            main: 0,
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
            special: 'special/'
        },
        monthly: {
            monthly: 'monthly/',
            info: 'monthly/info/'
        },
        search: {
            search: 'search',
            hot: 'search/hot'
        },
        reader: {
            chapter: 'chapters/'
        }
    }
}
/**
 * Created by chengshi on 2017/4/26.
 */
export default {
    version: '',    //app版本
    innerVersion: '',   // 获得当前终端的版本号
    isApp: false, //是否是在app内
    device: {   //设备信息
        isAndroid: true,    //是否在安卓环境内
        isIOS: false,   //是否在IOS环境内
        model: '',  //设备的型号
        imsi: '',   //设备的国际移动用户识别码 ,//Android - 2.2+ (支持): 如果设备没有插入SIM卡，则返回空数组。|iOS - 4.5+ (不支持): iOS设备不支持获取SIM卡信息，返回空数组。
        vendor: '',     // 设备的生产厂商
        uuid: '',   //设备的唯一标识
        screenHeight: 667,  //设备屏幕高度分辨率
        screenWidth: 375,   //设备屏幕宽度分辨率
        displayHeight: 667, // 设备屏幕高度逻辑分辨率
        displayWidth: 375,  // 设备屏幕高度逻辑分辨率
        headerHeight: 40,   // 顶部导航高度
        tabbarHeight: 55,   // 底部导航高度
        scale: 1,   //逻辑分辨率与实际分辨率的比例
        version: '',    //系统版本信息
        osName: ''  //系统的名称
    },
    common: {
        server: 'http://api.lveshu.com/',   // 服务器后台URL
        image: 'http://jjckb.xinhuanet.com/2016-05/20/135374404_14637120163591n.jpg',
        localPath: '_doc/' // 本地路径
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
        monthly: 'monthly/'
    }
}
/**
 * Created by chengshi on 2017/4/28.
 */
export default {
    //本地存储
    localStorage(key, value) {
        if (arguments.length === 0) {
            app.log.warn("没有参数");
            return;
        }
        if (app.isApp) {
            if (arguments.length === 1 || typeof(value) === "undefined") {
                return plus.storage.getItem(key);
            } else if (value === null || value === '') {
                plus.storage.removeItem(key);
            } else if (typeof(value) === "object") {
                plus.storage.setItem(key, JSON.stringify(value));
            } else {
                plus.storage.setItem(key, value);
            }
        } else {
            if (!window || !window.localStorage) {
                app.mui.alert("您开启了秘密浏览或无痕浏览模式，请关闭!");
                return;
            }
            if (arguments.length === 1 || typeof(value) === "undefined") {
                return window.localStorage.getItem(key);
            } else if (value === null || value === '') {
                window.localStorage.removeItem(key);
            } else if (typeof(value) === "object") {
                window.localStorage.setItem(key, JSON.stringify(value));
            } else {
                window.localStorage.setItem(key, value);
            }
        }
    },
    dateFormat(date, fmt){
        if (!date || !date instanceof Date) {
            return "";
        }
        var o = {
            "M+": date.getMonth() + 1, // 月份
            "d+": date.getDate(), // 日
            "h+": date.getHours(), // 小时
            "m+": date.getMinutes(), // 分
            "s+": date.getSeconds(), // 秒
            "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
            "S": date.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    },
    battery(object){
        if (app.config.device.isAndroid) {
            //注意，安卓需要配置下manifest.json文件，打开后，进入模块权限配置，在右侧的Android权限设置里勾选上android.permission.BATTERY_STATS
            let main = plus.android.runtimeMainActivity();
            let Intent = plus.android.importClass('android.content.Intent');
            let recevier = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
                onReceive: function (context, intent) {
                    let action = intent.getAction();
                    if (action == Intent.ACTION_BATTERY_CHANGED) {
                        object.battery = intent.getIntExtra("level", 0); //电量
                    }
                }
            });
            let IntentFilter = plus.android.importClass('android.content.IntentFilter');
            let filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
            main.registerReceiver(recevier, filter);
        } else if (app.config.device.isIOS) {
            let UIDevice = plus.ios.import("UIDevice");
            let dev = UIDevice.currentDevice();
            if (!dev.isBatteryMonitoringEnabled()) {
                dev.setBatteryMonitoringEnabled(true);
            }
            let level = dev.batteryLevel();
            chapter.battery = intent.getIntExtra("level", 0); //电量
        }
    }
}
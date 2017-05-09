/**
 * Created by chengshi on 2017/4/28.
 */
export default {
    isLogin(){
        return false;
    },
    getStartFlag(){
        if (!app.config.isApp) {    // 如果不是app始终返回true
            return true;
        }
        const start = app.util.localStorage('start');
        console.log(start);
        if (start) {
            return true;
        }
        return false;
    },
    setStartFlag(){
        app.util.localStorage('start', {version: app.config.version});
    }
}
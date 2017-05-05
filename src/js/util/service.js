/**
 * Created by chengshi on 2017/4/28.
 */
export default {
    isLogin(){
        return false;
    },
    getStartFlag(){
        //如果不是app始终返回true
        if (!app.config.isApp) {
            return true;
        }
        const startFlag = app.util.localStorage('startFlag');
        if (startFlag) {
            return true;
        }
        return false;
    }
}
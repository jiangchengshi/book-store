/**
 * Created by chengshi on 2017/4/28.
 */
export default {
    isLogin(){
        return false;
    },
    isWelcome(){
        if (!app.config.isApp) {    // 如果不是app始终返回true
            return true;
        }
        const welcome = app.util.localStorage('welcome');
        if (welcome) {
            const obj = JSON.parse(welcome);
            if (obj.version && obj.version == app.config.version) {
                return true;
            }
        }
        return false;
    },
    setWelcome(){
        app.util.localStorage('welcome', {version: app.config.version});
    },
    remWelcome(){
        app.util.localStorage('welcome', null);
    }
}
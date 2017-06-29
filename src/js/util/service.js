/**
 * Created by chengshi on 2017/6/23.
 */
export default {
    hasNetwork(){
        return app.config.setting.network.num >= 2;
    },
    checkLogin(cb_suc, cb_err){
        if (app.store.state.user.uid <= 0) {   // 登录过，重新打开应用
            app.webSql.query(app.config.webSql.login, {}, {}, (rows) => {
                if (rows && rows.length > 0) {  // 登录过，webSql已存储
                    let row = rows.item(0);
                    // 更新store
                    app.store.commit('updateUser', {
                        uid: row.uid,
                        username: row.username,
                        egold: row.egold
                    });

                    // 回调：正常业务页
                    if (typeof cb_suc == "function") cb_suc();
                } else {    // 未登录
                    // 回调：登录页
                    if (typeof cb_err == "function") cb_err();
                }
            });
        } else {    // 登陆过，store有值
            // 回调：正常业务页
            if (typeof cb_suc == "function") cb_suc();
        }
    },
    checkShelf(cb_suc, cb_err){
        app.webSql.query(app.config.webSql.shelf, {}, {}, (rows) => {
            if (rows && rows.length > 0) {  // 本地有书架信息
                if (typeof cb_suc == "function") cb_suc();
            } else {
                if (typeof cb_err == "function") cb_err();
            }
        });
    },
    checkUpdate(cb_suc, cb_err){
        app.ajax.get(app.config.api.setting.updates, {},
            (data) => {
                let version = data.result;
                app.webSql.query(app.config.webSql.updates, {}, {}, (rows) => {
                    if (rows && rows.length > 0) {  // 已保存版本信息
                        let row = rows.item(0);
                        if (version.versioncode != row.versioncode) {    // 有版本更新
                            app.webSql.update(app.config.webSql.updates, {
                                versioncode: version.versioncode,
                                versionname: version.versionname,
                                content: version.content,
                                url: version.url
                            });
                            if (typeof cb_suc == "function") cb_suc(version);
                        } else {
                            if (typeof cb_err == "function") cb_err(version);
                        }
                    } else {    // 不存在，则保存版本信息
                        app.webSql.insert(app.config.webSql.updates, {
                            versioncode: version.versioncode,
                            versionname: version.versionname,
                            content: version.content,
                            url: version.url
                        });
                        if (typeof cb_err == "function") cb_err(version);
                    }
                });
            }, (err) => {
                this.$vux.toast.show({
                    text: '系统异常，请稍后重试...',
                    type: 'warn'
                });
                app.log.error(err);
            });
    }
}
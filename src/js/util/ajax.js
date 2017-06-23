/**
 * Created by chengshi on 2017/4/26.
 */
import Vue from "vue";
// 引入qs：后台只支持form表单提交
import qs from "qs";

export default {
    get(url, params, cb_suc, cb_err){
        // Loading start...
        app.store.commit('updateLoading', {
            show: true,
            text: '数据加载中，请稍后...'
        });

        if (app.service.hasNetwork()) {
            Vue.http.get(processUrl(url), {
                params: params
            })
                .then(function (resp) {
                    // Loading end...
                    app.store.commit('updateLoading', {
                        show: false
                    });

                    if (resp.status == 200 && resp.data) {
                        if (typeof cb_suc == "function") cb_suc(resp.data);
                    } else {
                        if (typeof cb_err == "function") cb_err(resp);
                    }
                })
                .catch(function (err) {
                    // Loading end...
                    app.store.commit('updateLoading', {
                        show: false
                    });

                    if (typeof cb_err == "function") cb_err(err);
                });
        } else {
            app.store.commit('updateLoading', {
                show: false
            });

            if (typeof cb_err == "function") cb_err('网络异常,加载数据失败，请稍后重试...');
        }
    },
    put(url, data, cb_suc, cb_err){
        // Loading start...
        app.store.commit('updateLoading', {
            show: true,
            text: '数据提交中，请稍后...'
        });

        if (app.service.hasNetwork()) {
            Vue.http.put(processUrl(url), qs.stringify(data), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
                .then(function (resp) {
                    // Loading end...
                    app.store.commit('updateLoading', {
                        show: false
                    });

                    if (resp.status == 200 && resp.data) {
                        if (typeof cb_suc == "function") cb_suc(resp.data);
                    } else {
                        if (typeof cb_err == "function") cb_err(resp);
                    }
                })
                .catch(function (err) {
                    // Loading end...
                    app.store.commit('updateLoading', {
                        show: false
                    });

                    if (typeof cb_err == "function") cb_err(err);
                });
        } else {
            app.store.commit('updateLoading', {
                show: false
            });

            if (typeof cb_err == "function") cb_err('网络异常,提交数据失败，请稍后重试...');
        }
    },
    post(url, data, cb_suc, cb_err){
        // Loading start...
        app.store.commit('updateLoading', {
            show: true,
            text: '数据提交中，请稍后...'
        });

        if (app.service.hasNetwork()) {
            Vue.http.post(processUrl(url), qs.stringify(data), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
                .then(function (resp) {
                    // Loading end...
                    app.store.commit('updateLoading', {
                        show: false
                    });

                    if (resp.status == 200 && resp.data) {
                        if (typeof cb_suc == "function") cb_suc(resp.data);
                    } else {
                        if (typeof cb_err == "function") cb_err(resp);
                    }
                })
                .catch(function (err) {
                    // Loading end...
                    app.store.commit('updateLoading', {
                        show: false
                    });

                    if (typeof cb_err == "function") cb_err(err);
                });
        } else {
            app.store.commit('updateLoading', {
                show: false
            });

            if (typeof cb_err == "function") cb_err('网络异常,提交数据失败，请稍后重试...');
        }
    },
    delete(url, param, cb_suc, cb_err) {
        // Loading start...
        app.store.commit('updateLoading', {
            show: true,
            text: '数据删除中，请稍后...'
        });

        if (app.service.hasNetwork()) {
            Vue.http.delete(processUrl(url), {
                params: params
            })
                .then(function (resp) {
                    // Loading end...
                    app.store.commit('updateLoading', {
                        show: false
                    });

                    if (resp.status == 200 && resp.data) {
                        if (typeof cb_suc == "function") cb_suc(resp.data);
                    } else {
                        if (typeof cb_err == "function") cb_err(resp);
                    }
                })
                .catch(function (err) {
                    // Loading end...
                    app.store.commit('updateLoading', {
                        show: false
                    });

                    if (typeof cb_err == "function") cb_err(err);
                });
        } else {
            app.store.commit('updateLoading', {
                show: false
            });

            if (typeof cb_err == "function") cb_err('网络异常,删除数据失败，请稍后重试...');
        }
    }
}

// 添加服务器端URL
function processUrl(url) {
    return app.config.setting.server + url;
}
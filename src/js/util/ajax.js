/**
 * Created by chengshi on 2017/4/26.
 */
import Vue from "vue";
// 引入qs：后台只支持form表单提交
import qs from "qs";

export default {
    get(url, params, cb_suc, cb_err){
        // Loading start...
        app.store.commit('updateLoading', true);

        Vue.http.get(processUrl(url), {
            params: params
        })
            .then(function (resp) {
                // Loading end...
                app.store.commit('updateLoading', false);

                cb_suc(resp);
            })
            .catch(function (err) {
                // Loading end...
                app.store.commit('updateLoading', false);

                cb_err(err);
            });
    },
    put(url, data, cb_suc, cb_err){
        // Loading start...
        app.store.commit('updateLoading', true);
        Vue.http.put(processUrl(url), qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
            .then(function (resp) {
                // Loading end...
                app.store.commit('updateLoading', false);

                cb_suc(resp);
            })
            .catch(function (err) {
                // Loading end...
                app.store.commit('updateLoading', false);

                cb_err(err);
            });
    },
    post(url, data, cb_suc, cb_err){
        // Loading start...
        app.store.commit('updateLoading', true);

        Vue.http.post(processUrl(url), qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
            .then(function (resp) {
                // Loading end...
                app.store.commit('updateLoading', false);

                cb_suc(resp);
            })
            .catch(function (err) {
                // Loading end...
                app.store.commit('updateLoading', false);

                cb_err(err);
            });
    },
    delete(url, param, cb_suc, cb_err){
        // Loading start...
        app.store.commit('updateLoading', true);

        Vue.http.delete(processUrl(url), {
            params: params
        })
            .then(function (resp) {
                // Loading end...
                app.store.commit('updateLoading', false);

                cb_suc(resp);
            })
            .catch(function (err) {
                // Loading end...
                app.store.commit('updateLoading', false);

                cb_err(err);
            });
    }
}

// 添加服务器端URL
function processUrl(url) {
    return app.config.setting.server + url;
}
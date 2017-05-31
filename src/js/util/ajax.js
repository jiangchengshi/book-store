/**
 * Created by chengshi on 2017/4/26.
 */
import Vue from "vue";

export default {
    get(url, param, cb_suc, cb_err){
        Vue.http.get(processUrl(url), param)
            .then(function (resp) {
                cb_suc(resp);
            })
            .catch(function (err) {
                cb_err(err);
            });
    },
    put(url, data, cb_suc, cb_err){
        Vue.http.put(processUrl(url), data, {emulateJSON: true})
            .then(function (resp) {
                cb_suc(resp);
            })
            .catch(function (err) {
                cb_err(err);
            });
    },
    post(url, data, cb_suc, cb_err){
        Vue.http.post(processUrl(url), data, {emulateJSON: true})
            .then(function (resp) {
                cb_suc(resp);
            })
            .catch(function (err) {
                cb_err(err);
            });
    },
    delete(url, param, cb_suc, cb_err){
        Vue.http.delete(processUrl(url), param)
            .then(function (resp) {
                cb_suc(resp);
            })
            .catch(function (err) {
                cb_err(err);
            });
    }
}

// 添加服务器端URL
function processUrl(url) {
    return app.config.setting.server + url;
}
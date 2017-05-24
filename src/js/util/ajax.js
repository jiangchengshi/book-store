/**
 * Created by chengshi on 2017/4/26.
 */
import axios from "axios";

export default {
    get(url, params, cb_success, cb_error){
        url = app.config.common.server + url;
        axios.get(url, {params: params})
            .then(function (resp) {
                cb_success(resp);
            })
            .catch(function (err) {
                cb_error(err);
            });
    },
    put(url, data, cb_success, cb_error){
        url = app.config.common.server + url;
        axios.put(url, data)
            .then(function (resp) {
                cb_success(resp);
            })
            .catch(function (err) {
                cb_error(err);
            });
    },
    post(url, data, cb_success, cb_error){
        url = app.config.common.server + url;
        axios.post(url, data)
            .then(function (resp) {
                cb_success(resp);
            })
            .catch(function (err) {
                cb_error(err);
            });
    },
    delete(url, param, cb_success, cb_error){
        url = app.config.common.server + url;
        axios.delete(url, param)
            .then(function (resp) {
                cb_success(resp);
            })
            .catch(function (err) {
                cb_error(err);
            });
    }
}
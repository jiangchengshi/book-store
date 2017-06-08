/**
 * Created by chengshi on 2017/6/8.
 */
/*数据库名*/
const dbName = 'book';
/*数据库版本*/
const dbVersion = '1.0';
/*数据库描述*/
const dbDesc = 'book-store';
/*数据库大小:以字节为单位 */
const dbSize = 10 * 1024 * 1024;
/*暂存数据库对象*/
let db = null;

export default {
    open(){
        /*数据库有就打开 没有就创建*/
        db = window.openDatabase(dbName, dbVersion, dbDesc, dbSize, function (e) {
            app.log.info(e);
        });
    },
    create(table, column){
        let columnStr = "";
        Object.keys(column).forEach(function (col, i) {
            if (i > 0) {
                columnStr += ", "
            }
            columnStr += col + " " + column[col];
        });
        let sql = "CREATE TABLE IF NOT EXISTS " + table + " (" + columnStr + ")";
        // let sql = "DROP TABLE " + table;
        db.transaction(function (ctx, result) {
            ctx.executeSql(sql, [], function (ctx, result) {
                app.log.info("create/check table " + table + " => " + sql);
            }, function (tx, err) {
                app.log.error("create/check table " + table + " fail => " + sql + " => " + err.message);
            });
        });
    },
    query(table, condition, callback){
        let sql = "SELECT * FROM " + table + " WHERE 1=1 ";
        Object.keys(condition).forEach(function (con) {
            sql += " AND " + con + " = '" + condition[con] + "'";
        });
        db.transaction(function (ctx) {
            ctx.executeSql(sql, [], function (ctx, result) {
                    if (typeof callback == "function") {
                        callback(result.rows);
                    }
                },
                function (tx, err) {
                    app.log.error("query " + table + " fail => " + sql + " => " + err.message);
                });
        });
    },
    insert(table, columnArr, dataArr, callback){
        let columnStr = "", paramStr = "";
        columnArr.forEach(function (col, i) {
            if (i > 0) {
                columnStr += ", ";
                paramStr += ",";
            }
            columnStr += col;
            paramStr += "?";
        });
        let sql = "INSERT INTO " + table + "(" + columnStr + ") VALUES(" + paramStr + ")";
        db.transaction(function (ctx) {
            ctx.executeSql(sql, dataArr, function (ctx, result) {
                    if (typeof callback == "function") {
                        callback(result);
                    }
                },
                function (tx, err) {
                    app.log.error("insert " + table + " fail => " + sql + " => " + dataArr + " => " + err.message);
                });
        });
    },
    update(table, set, condition, callback){
        let sql = "UPDATE " + table + " SET ";
        Object.keys(set).forEach(function (s, i) {
            if (i > 0) {
                sql += ", ";
            }
            sql += s + " = '" + set[s] + "'";
        });
        sql += " WHERE 1=1 ";
        Object.keys(condition).forEach(function (con) {
            sql += " AND " + con + " = '" + condition[con] + "'";
        });
        db.transaction(function (ctx, result) {
            ctx.executeSql(sql, [], function (ctx, result) {
                if (typeof callback == "function") {
                    callback(result);
                }
            }, function (tx, err) {
                app.log.error("update " + table + " fail => " + sql + " => " + err.message);
            });
        });
    },
    delete(table, condition, callback){
        let sql = "DELETE FROM " + table + " WHERE 1=1 ";
        Object.keys(condition).forEach(function (con) {
            sql += " AND " + con + " = " + condition[con];
        });
        db.transaction(function (ctx, result) {
            ctx.executeSql(sql, [], function (ctx, result) {
                if (typeof callback == "function") {
                    callback(result);
                }
            }, function (tx, err) {
                app.log.error("delete " + table + " fail => " + sql + " => " + err.message);
            });
        });
    }
}
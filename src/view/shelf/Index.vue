<template>
    <div class="shelf-index">
        <div>
            <img src="../../image/sign.png" style="width:50px;height:60px;position: fixed;right: 10px;z-index: 1;"
                 @click="handleSign">
            <grid>
                <grid-item v-for="book in books" :key="book.articleid" @on-item-click="handleClickBook(book.articleid)">
                    <div v-if="book.articleid!=-1">
                        <img :src="book.cover" :class="{tidy: tidy && book.del}"
                             style="width: 85px;height: 110px;float: left;">
                        <icon v-if="tidy && book.del" type="success"
                              style="color: #ee4d22;float: left;margin-left: -33px;margin-top: 78px;opacity: 1;"></icon>
                    </div>
                    <div v-else>
                        <i class="iconfont icon-add"></i>
                        <span>去书城看看</span>
                    </div>
                    <span class="name" v-html="book.articlename"></span>
                    <span class="author" v-html="book.author"></span>
                </grid-item>
            </grid>
        </div>
        <x-button v-show="tidy" action-type="button" @click.native="handleDelete"
                  style="position:fixed;bottom:0px;line-height:53px;background: #35B4EB;border-radius: 7px;color: #FFFFFF;z-index: 600;">
            删除
        </x-button>

        <!-- 签到 -->
        <c-dialog type="signIn" :show="show.signIn" :data="sign" @confirm="handleSignIn"
                  @cancel="show.signIn=false"></c-dialog>
        <!-- 签到成功-->
        <c-dialog type="signOk" :show="show.signOk" :data="sign" @confirm="handleSignOk"
                  @cancel="show.signOk=false"></c-dialog>
    </div>
</template>

<script>
    import {Grid, GridItem, Icon, XButton} from 'vux';
    import CDialog from '../../view/components/Dialog.vue';

    export default {
        data () {
            return {
                books: [],
                sign: {},
                show: {
                    signIn: false,
                    signOk: false
                }
            }
        },
        components: {
            Grid, GridItem, Icon, XButton, CDialog
        },
        methods: {
            getBookData(){
                // 1. 有网络：请求服务=> 获取书架书籍
                if (app.service.hasNetwork()) {
                    app.ajax.get(app.config.api.shelf.list + this.$store.state.user.uid, {},
                        (data) => {
                            this.fillShelf(data.result);

                            // 同步 本地
                            if (data.result.length > 0) {
                                this.syncLocal(data.result);
                            }
                        }, (err) => {
                            this.$vux.toast.show({
                                text: '系统异常，请稍后重试...',
                                type: 'warn'
                            });
                            app.log.error(err);
                        });
                }
                // 2. 无网络：本地=> 获取书架书籍
                else {
                    app.webSql.query(app.config.webSql.shelf, {}, {}, (rows) => {
                        if (rows && rows.length <= 0) {
                            this.$vux.toast.show({
                                text: '还没有添加过书籍哦!',
                                isShowMask: true
                            });
                            return;
                        }

                        this.fillShelf(rows);
                    });
                }
            },
            getSignData(){
                app.ajax.get(app.config.api.sign + this.$store.state.user.uid, {},
                    (data) => {
                        this.sign = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            handleSign(){
                this.show.signIn = true;
            },
            handleSignIn(){
                app.ajax.post(app.config.api.sign, {
                    uid: this.$store.state.user.uid
                }, (data) => {
                    if (data.result.result == 1) { // 1:成功
                        // 更新用户egold
                        let egold = Number(this.$store.state.user.egold) + Number(data.result.egold);
                        this.$store.commit('updateUser', {egold: egold});

                        this.show.signOk = true;
                        this.show.signIn = false;
                    } else if (data.result.result == 2) {   // 2:用户不存在
                        this.$vux.toast.show({
                            text: '用户不存在',
                            type: 'warn'
                        });
                    } else if (data.result.result == 3) {   // 3:已签到
                        this.$vux.toast.show({
                            text: '已签到',
                            type: 'info'
                        });
                    }
                }, (err) => {
                    this.$vux.toast.show({
                        text: '系统异常，请稍后重试...',
                        type: 'warn'
                    });
                    app.log.error(err);
                });
            },
            handleSignOk(){
                this.show.signOk = false;
                this.$router.push({path: '/mine/token'});
            },
            handleClickBook(id){
                if (!this.tidy) {   // true：非整理状态，点击进入书籍阅读
                    if (id == -1) {
                        this.$router.push({path: '/mall'});
                    } else {
                        this.$router.push({path: '/reader', query: {id: id}});
                    }
                } else {    // 整理状态
                    for (let i = 0; i < this.books.length; i++) {
                        if (this.books[i].articleid == id) {
                            this.books[i].del = !this.books[i].del;
                            return;
                        }
                    }
                }
            },
            handleDelete(){
                let delBookId = [];
                for (let i = 0; i < this.books.length; i++) {
                    if (this.books[i].del) {
                        delBookId.push(this.books[i].articleid);
                    }
                }
                if (delBookId.length <= 0) {
                    this.$vux.toast.show({
                        text: '请选择书架中的书籍',
                        type: 'warn'
                    });
                    return;
                }

                // 请求删除
                app.ajax.post(app.config.api.shelf.delete, {
                    uid: this.$store.state.user.uid,
                    articleid: delBookId.join(',')
                }, (data) => {
                    if (data.result.result == 1) { // 1：成功
                        this.$vux.toast.show({
                            text: '删除成功',
                            type: 'info'
                        });
                        this.getBookData();
                    } else if (data.result.result == 2) {   // 2:用户不存在
                        this.$vux.toast.show({
                            text: '用户不存在',
                            type: 'warn'
                        });
                    } else if (data.result.result == 3) {   // 3:书籍不存在
                        this.$vux.toast.show({
                            text: '书籍不存在',
                            type: 'warn'
                        });
                    }
                }, (err) => {
                    this.$vux.toast.show({
                        text: '系统异常，请稍后重试...',
                        type: 'warn'
                    });
                    app.log.error(err);
                });
            },
            fillShelf(bookArr){
                // 清空
                this.books = [];

                // mall-link
                bookArr.push({
                    articleid: -1,
                    articlename: '&nbsp;',
                    author: '&nbsp;',
                    cover: ''
                });

                // 书籍删除标识
                bookArr.forEach((book, i) => {
                    // 默认 del标识为false
                    if (book.articleid != -1) {
                        book.del = false;
                    }
                    this.books.push(book);
                });
            },
            syncLocal(bookArr){

            }
        },
        computed: {
            tidy(){
                let tidy = this.$store.state.header.tidyText == '完成';
                if (!tidy) {
                    for (let i = 0; i < this.books.length; i++) {
                        if (this.books[i].del) {
                            this.books[i].del = false;
                        }
                    }
                }
                return tidy;
            }
        },
        created(){
            // 非全屏显示
            if (app.config.setting.isApp) {
                plus.navigator.setFullscreen(false);
            }

            this.$store.commit('updateHeader', {
                title: '书架'
            });
        },
        mounted(){
            // 获取 书架数据
            this.getBookData();

            // 获取 签到信息
            this.getSignData();
        }
    }
</script>

<style>
    .shelf-index {
        height: inherit;
        width: 100%;
        position: relative;
    }

    .shelf-index .weui-grids a span {
        display: block;
        width: 96px;
        height: 16px;
        line-height: 16px;
        overflow: hidden;
    }

    .shelf-index .weui-grids a .name {
        font-size: 14px;
        margin-top: 2px;
        color: #162636;
    }

    .shelf-index .weui-grids a .author {
        font-size: 12px;
        color: #989A9C;
    }

    .shelf-index .weui-grids:last-child a:last-child div {
        width: 90px;
        height: 110px;
        border: dashed 1px #35B4EB;
        text-align: center;
        display: table-cell;
        vertical-align: middle;
    }

    .shelf-index .weui-grids:last-child a:last-child div .iconfont {
        font-size: 35px;
        color: #35B4EB;
    }

    .shelf-index .weui-grids:last-child a:last-child div span {
        font-size: 12px;
        color: #35B4EB;
    }

    .shelf-index .weui-dialog {
        overflow: initial;
    }

    .shelf-index .weui-grids a .tidy {
        opacity: 0.3;
    }

    .shelf-index .weui-grids .weui-grid:before, .shelf-index .weui-grids .weui-grid:after {
        border: initial;
    }
</style>
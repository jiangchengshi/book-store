<template>
    <div class="shelf-index">
        <div style="height: inherit;">
            <img src="../../image/sign.png" style="width:50px;height:60px;position: fixed;right: 10px;"
                 @click="handleSign">
            <ul class="books" v-for="book in books">
                <li class="book" v-for="b in book" @click="handleClickBook(b.articleid)">
                    <div v-if="b.articleid!=-1">
                        <img :src="b.cover" :class="{tidy: tidy && b.del}"
                             style="width: 85px;height: 110px;float: left;">
                        <icon v-if="tidy && b.del" type="success"
                              style="color: #ee4d22;float: left;margin-left: -33px;margin-top: 78px;opacity: 1;"></icon>
                    </div>
                    <div v-else>
                        <i class="iconfont icon-add"></i>
                        <span>去书城看看</span>
                    </div>
                    <span class="name" v-html="b.articlename"></span>
                    <span class="author" v-html="b.author"></span>
                </li>
            </ul>
        </div>
        <x-button v-show="tidy" action-type="button" @click="handleDelete"
                  style="position:absolute; bottom: 10px;background: #35B4EB;border-radius: 7px;color: #FFFFFF;">删除
        </x-button>

        <!-- 签到 -->
        <c-dialog type="signIn" :show="show.signIn" :data="sign" @signIn="handleSignIn"
                  @cancel="show.signIn=false"></c-dialog>
        <!-- 签到成功-->
        <c-dialog type="signOk" :show="show.signOk" :data="sign" @signOk="handleSignOk"
                  @cancel="show.signOk=false"></c-dialog>
    </div>
</template>

<script>
    import {Icon, XButton} from 'vux';
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
            Icon, XButton, CDialog
        },
        methods: {
            getBookData(){
                // 1. 本地=> 获取书架书籍
//                app.webSql.query(app.config.webSql.shelf, {}, {}, (rows) => {
//                    if (rows && rows.length <= 0) {
//                        this.$vux.toast.show({
//                            text: '还没有添加过书籍哦!',
//                            isShowMask: true
//                        });
//                        return;
//                    }
//
//                    this.handleShelf(rows);
//                });

                // 2. 请求服务=> 获取书架书籍
                app.ajax.get(app.config.api.shelf.list + this.$store.state.user.uid, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.fillShelf(data);
                        }
                    }
                }, (err) => {
                });
            },
            getSignData(){
                app.ajax.get(app.config.api.sign + this.$store.state.user.uid, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.sign = data;
                        }
                    }
                }, (err) => {
                });
            },
            handleSign(){
                if (this.$store.state.user.uid <= 0) {
                    this.$router.push({path: '/entry/login'});
                    return;
                }
                this.show.signIn = true;
            },
            handleSignIn(){
                app.ajax.post(app.config.api.sign, {
                    uid: this.$store.state.user.uid
                }, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            if (data.result == 1) { // 1:成功
                                // 更新用户egold
                                let egold = Number(this.$store.state.user.egold) + Number(data.egold);
                                this.$store.commit('updateUser', {egold: egold});

                                this.show.signOk = true;
                                this.show.signIn = false;
                            } else if (data.result == 2) {   // 2:用户不存在
                                this.$vux.toast.show({
                                    text: '用户不存在',
                                    type: 'warn'
                                });
                            } else if (data.result == 3) {   // 3:已签到
                                this.$vux.toast.show({
                                    text: '已签到',
                                    type: 'info'
                                });
                            }
                        }
                    }
                }, (err) => {
                });
            },
            handleSignOk(){
                this.$vux.toast.show({
                    text: '看看我的券吧',
                    type: 'info'
                })
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
                        let _books = this.books[i];
                        for (let j = 0; j < _books.length; j++) {
                            if (_books[j].articleid == id) {
                                _books[j].del = !_books[j].del;
                                return;
                            }
                        }
                    }
                }
            },
            handleDelete(){
                let delBookId = [];
                for (let i = 0; i < this.books.length; i++) {
                    let _books = this.books[i];
                    for (let j = 0; j < _books.length; j++) {
                        if (_books[j].del) {
                            delBookId.push(_books[j].articleid);
                        }
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
                }, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            if (data.result == 1) { // 1：成功
                                this.$vux.toast.show({
                                    text: '删除成功',
                                    type: 'info'
                                });
                                this.getBookData();
                            } else if (data.result == 2) {   // 2:用户不存在
                                this.$vux.toast.show({
                                    text: '用户不存在',
                                    type: 'warn'
                                });
                            } else if (data.result == 3) {   // 3:书籍不存在
                                this.$vux.toast.show({
                                    text: '书籍不存在',
                                    type: 'warn'
                                });
                            }
                        }
                    }
                }, (err) => {
                });
            },
            fillShelf(bookArr){
                // mall-link
                bookArr.push({
                    articleid: -1,
                    articlename: '&nbsp;',
                    author: '&nbsp;',
                    cover: ''
                });

                // 书籍分3层
                let _books = [];
                bookArr.forEach((book, i) => {
                    // 默认 del标识为false
                    if (book.articleid != -1) {
                        book.del = false;
                    }

                    // 书架 一层3本书籍
                    if (i > 0 && i % 3 == 0) { // 3, 6
                        this.books.push(_books);
                        _books = [];
                    }
                    _books.push(book);
                    if (i == bookArr.length - 1) {
                        this.books.push(_books);
                    }
                });
            }
        },
        computed: {
            tidy(){
                let tidy = this.$store.state.header.tidyText == '完成';
                if (!tidy) {
                    for (let i = 0; i < this.books.length; i++) {
                        let _books = this.books[i];
                        for (let j = 0; j < _books.length; j++) {
                            if (_books[j].del) {
                                _books[j].del = false;
                            }
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
        background-color: #F8F8F8;
    }

    .shelf-index ul {
        list-style: none;
        padding: 16px 0px;
        margin: 0px auto;
    }

    .shelf-index .books .book {
        display: inline-block;
        margin: 0px 5px 0px 20px;
    }

    .shelf-index .books .book span {
        display: block;
        width: 96px;
        height: 16px;
        line-height: 16px;
        overflow: hidden;
    }

    .shelf-index .books .book .name {
        font-size: 14px;
        margin-top: 2px;
    }

    .shelf-index .books .book .author {
        font-size: 12px;
        color: #989A9C;
    }

    .shelf-index .books:last-child .book:last-child div {
        width: 90px;
        height: 110px;
        border: dashed 1px #35B4EB;
        text-align: center;
        display: table-cell;
        vertical-align: middle;
    }

    .shelf-index .books:last-child .book:last-child div .iconfont {
        font-size: 35px;
        color: #35B4EB;
    }

    .shelf-index .books:last-child .book:last-child div span {
        font-size: 12px;
        color: #35B4EB;
    }

    .shelf-index .weui-dialog {
        overflow: initial;
    }

    .shelf-index .books .book .tidy {
        opacity: 0.3;
    }
</style>
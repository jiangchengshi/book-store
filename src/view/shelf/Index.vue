<template>
    <div class="shelf">
        <mt-header :title="title">
            <mt-button slot="right" @tap.stop="handleTapTidy" style="color: blue">整理</mt-button>
        </mt-header>
        <div class="content" :style="{width: shelf.width+'px', height: shelf.height+'px'}">
            <div class="stage" v-for="book in books">
                <ul class="books-list">
                    <li v-for="b in book">
                        <img :src="b.image" :data-code="b.code" @tap="handleTapBook">
                        <span class="name" v-html="b.name"></span>
                        <span class="author" v-html="b.author"></span>
                    </li>
                    <li v-if="book.length<3">
                        <img src="../../image/goMall.png" data-code="mall" @tap="handleTapGoMall">
                        <span class="name">&nbsp;</span>
                        <span class="author">&nbsp;</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'shelf',
        data () {
            return {
                title: '书架',
                books: [],
                shelf: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            handleTapBook(e){
                // 隐藏书城 tabBar
                this.$store.commit('updateMallBar', false);

                this.openBook(name);
            },
            handleTapGoMall(){
                this.$router.push({path: 'mall'});
            },
            openBook(name){    // 打开书籍
                let _this = this;
                let localFile = _this.$store.state.localPath + name;
                if (app.config.isApp) {
                    // 检查是否已下载
                    plus.io.resolveLocalFileSystemURL(localFile, function (fe) {
                        _this.$router.push({path: 'reader', query: {name: name}});
                    }, function (e) {   // 未下载， 先从书城下载书籍
                        _this.downloadBook(name);
                    });
                } else {    // web
                    _this.$router.push({path: 'reader', query: {name: name}});
                }
            },
            downloadBook(name){ // 下载书籍
                console.log('download book ' + name);
                let _this = this;
                let remoteFile = app.config.common.server + name;
                let downloader = plus.downloader.createDownload(remoteFile, {
                    filename: _this.$store.state.localPath + name
                }, function (d, status) {
                    if (status == 200) {
                        _this.$router.push({path: 'reader', query: {name: name}});
                    } else {
                        app.mui.toast('打开' + name + '失败:' + status);
                    }
                });
                //					downloader.addEventListener("statechanged", function(d, status) {
                //						console.log(d.filename + ":" + status);
                //					}, false);
                downloader.start();
            },
            handleTapTidy(){
                app.mui.toast('整理啥，凑合着看吧...');
            }
        },
        created(){
            // 欢迎 界面
            if (!app.service.isWelcome()) {
                this.$router.replace({name: 'welcome'});
                return;
            }

            // 宽度/高度
            this.shelf.width = app.config.device.screenWidth;
            this.shelf.height = app.config.device.screenHeight - app.config.device.headerHeight - app.config.device.tabbarHeight;

            // 显示书城底部导航菜单
            this.$store.commit('updateMallBar', true);

            // 获取可展示的书籍： 仅展示8本 + 去书城
            // todo getStorage
            let bookArr = [{
                code: 'rmdmy.txt',
                name: '盗墓笔记',
                author: '南派三叔',
                image: app.config.common.image
            }, {
                code: 'rmdmy.txt',
                name: '盗墓笔记2',
                author: '南派三叔2',
                image: app.config.common.image
            }, {
                code: 'rmdmy.txt',
                name: '盗墓笔记3',
                author: '南派三叔3',
                image: app.config.common.image
            }, {
                code: 'rmdmy.txt',
                name: '盗墓笔记4',
                author: '南派三叔4',
                image: app.config.common.image
            }];
            if (bookArr.length <= 0) {
                app.mui.toast('还没有添加过书籍哦!');
                return;
            } else if (bookArr.length > 8) {
                app.mui.toast('显示书籍超过最大值[8]');
            }

            // 书籍最多展示7本
            if (bookArr.length >= 8) {
                bookArr.length = 7;
            }
            // 书籍分3层
            let _books = [];
            bookArr.forEach((book, i) => {
                if (i > 0 && i % 3 == 0) { // 3, 6
                    this.books.push(_books);
                    _books = [];
                }
                _books.push(book);
                if (i == bookArr.length - 1) {
                    this.books.push(_books);
                }
            });
        },
        mounted(){
            // 返回键处理：1秒内，连续两次按返回键，则退出应用
            let first = null;
            if (app.config.isApp) {
                plus.key.addEventListener('backbutton', () => {
                    if (this.$route.name == 'shelf') {
                        //首次按键，提示‘再按一次退出应用’
                        if (!first) {
                            first = new Date().getTime();
                            app.mui.toast('再按一次退出应用');
                            setTimeout(function () {
                                first = null;
                            }, 1000);
                        } else {
                            if (new Date().getTime() - first < 1000) {
                                // 清空 欢迎标识
                                app.service.remWelcome();

                                // 退出
                                plus.runtime.quit();
                            }
                        }
                        return;
                    }
                }, false);
            }
        }
    }
</script>

<style scoped>
    .shelf {
        font-family: PingFangSC-Regular;
    }

    .shelf header {
        background-color: white;
        color: #162636
    }

    .content {
        position: relative;
        background-color: #F8F8F8;
    }

    .content .stage {
        text-align: center;
        padding-top: 10px;
    }

    .content ul {
        list-style: none;
        padding: initial;
    }

    .content .books-list li {
        display: inline-block;
        margin: 0px 15px;
    }

    .content .books-list li img {
        width: 85px;
        height: 120px;
    }

    .content .books-list li span {
        display: block;
        line-height: 16px;
    }

    .content .books-list li .name {
        font-size: 14px;
    }

    .content .books-list li .author {
        font-size: 12px;
        color: #989A9C;
    }
</style>
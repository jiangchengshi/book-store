<template>
    <div class="shelf">
        <header class="mui-bar mui-bar-nav">
            <h1 class="mui-title">{{title}}</h1>
            <a class="mui-pull-right" @tap.stop="handleTapTidy">整理</a>
        </header>
        <div class="mui-content">
            <div class="stage" :style="{width: shelf.width}" v-for="book in books">
                <ul class="books-list">
                    <li v-for="b in book">
                        <img v-if="b.code=='store'" src="../../image/store.png">
                        <img v-else :src="b.img" :data-code="b.code" @tap="handleClickBook">
                        <span class="name" v-html="b.name"></span>
                        <span class="author" v-html="b.author"></span>
                    </li>
                </ul>
            </div>
        </div>
        <nav class="mui-bar mui-bar-tab">
            <a class="mui-tab-item" @tap.stop="handleTapStore">
                <span class="mui-icon iconfont icon-shuchengxuanzhong"></span>
                <span class="mui-tab-label">书城</span>
            </a>
            <a class="mui-tab-item" @tap.stop="handleTapSearch">
                <span class="mui-icon iconfont icon-mp-search"></span>
                <span class="mui-tab-label">搜索</span>
            </a>
            <a class="mui-tab-item mui-active" @tap.stop="handleTapShelf">
                <span class="mui-icon iconfont icon-books"></span>
                <span class="mui-tab-label">书架</span>
            </a>
            <a class="mui-tab-item" @tap.stop="handleTapMine">
                <span class="mui-icon iconfont icon-foot04"></span>
                <span class="mui-tab-label">我的</span>
            </a>
        </nav>
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
                    width: 0
                }
            }
        },
        methods: {
            handleClickBook(e){
                let name = e.target.dataset.code;
                if (name == "store") {
                    this.handleTapStore();
                    return;
                }
                this.openBook(name);
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
                let remoteFile = _this.$store.state.storeUrl + name;
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
            handleTapStore(){
                app.mui.toast('书城建设中...');
            },
            handleTapSearch(){
                app.mui.toast('搜索开发中...');
            },
            handleTapShelf(){
                this.$router.push({path: 'shelf'});
            },
            handleTapMine(){
                app.mui.toast('我的思考中...');
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

            // 宽度
            this.shelf.width = app.config.device.screenWidth + 'px';

            // 获取可展示的书籍： 仅展示8本 + 去书城
            // todo getStorage
            let bookArr = [{
                code: 'rmdmy.txt',
                name: '盗墓笔记',
                author: '南派三叔',
                img: 'http://jjckb.xinhuanet.com/2016-05/20/135374404_14637120163591n.jpg'
            }, {
                code: 'rmdmy.txt',
                name: '盗墓笔记2',
                author: '南派三叔2',
                img: 'http://jjckb.xinhuanet.com/2016-05/20/135374404_14637120163591n.jpg'
            }, {
                code: 'rmdmy.txt',
                name: '盗墓笔记3',
                author: '南派三叔3',
                img: 'http://jjckb.xinhuanet.com/2016-05/20/135374404_14637120163591n.jpg'
            }, {
                code: 'rmdmy.txt',
                name: '盗墓笔记4',
                author: '南派三叔4',
                img: 'http://jjckb.xinhuanet.com/2016-05/20/135374404_14637120163591n.jpg'
            }];
            if (bookArr.length <= 0) {
                app.mui.toast('还没有添加过书籍哦!');
                return;
            } else if (bookArr.length > 8) {
                app.mui.toast('显示书籍超过最大值[8]');
            }
            // 最后本书籍信息： 去书城
            var lastPos = 8;
            if (bookArr.length < 7) {
                lastPos = bookArr.length + 1;
            }
            bookArr[lastPos] = {
                code: 'store',
                name: '&nbsp;',
                author: '&nbsp;',
                img: './build/store.png'
            };

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
        margin: 0;
        padding: 0;
        font-family: PingFangSC-Regular;
    }

    .mui-pull-right {
        line-height: 44px;
    }

    .mui-content {
        position: relative;
    }

    .mui-content .stage {
        text-align: center;
    }

    .mui-content ul {
        list-style: none;
        padding: initial;
    }

    .mui-content .books-list li {
        display: inline-block;
        margin: 0px 15px;
    }

    .mui-content .books-list li img {
        width: 85px;
        height: 120px;
    }

    .mui-content .books-list li span {
        display: block;
        line-height: 16px;
    }

    .mui-content .books-list li .name {
        font-size: 14px;
    }

    .mui-content .books-list li .author {
        font-size: 12px;
        color: #989A9C;
    }
</style>
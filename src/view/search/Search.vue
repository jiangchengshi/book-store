<template>
    <div class="search">
        <search placeholder="输入书名/作者" v-model="keyword" auto-scroll-to-top :auto-fixed="false"
                @on-submit="handleSubmit" @on-focus="handleFocus" @on-cancel="handleCancel"></search>
        <div style="background: #F8F8F8;overflow: scroll;" :style="{height: height+'px'}">
            <div class="hot" v-if="!showResult">
                <span class="title">热门搜索</span>
                <div class="key">
                    <span v-for="(hot, index) in data.hot" :key="index">{{hot.name}}</span>
                </div>
            </div>
            <div class="result" v-else>
                <div class="match" v-if="result=='match'">
                    <span class="info">搜索到 <label style="color: #5FAFF8;">{{data.result.length}}</label> 个结果：</span>
                    <c-list-view type="book" :list="data.result"></c-list-view>
                </div>
                <div class="unMatch" v-else-if="result=='unMatch'">
                    <img width="80" height="80" src="../../image/unMatch.png"/>
                    <span style="display: block;">很抱歉，没有找到相匹配的书籍！</span>
                </div>
                <div class="index" v-else>
                    您可以输入书名/作者进行搜索！
                </div>
            </div>
        </div>
        <tabbar>
            <tabbar-item link="/mall">
                <span slot="icon"><i class="iconfont icon-shuchengxuanzhong"></i></span>
                <span slot="label">书城</span>
            </tabbar-item>
            <tabbar-item link="/search" selected>
                <span slot="icon"><i class="iconfont icon-sousuo2"></i></span>
                <span slot="label">搜索</span>
            </tabbar-item>
            <tabbar-item link="/shelf">
                <span slot="icon"><i class="iconfont icon-bookshelf"></i></span>
                <span slot="label">书架</span>
            </tabbar-item>
            <tabbar-item link="/mine">
                <span slot="icon"><i class="iconfont icon-wode1"></i></span>
                <span slot="label">我的</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>

<script>
    import {Search, Tabbar, TabbarItem} from 'vux';
    import CListView from '../components/ListView.vue';

    export default {
        data () {
            return {
                width: app.config.setting.width.screen,
                height: app.config.setting.height.search,
                keyword: '',
                data: {
                    result: [],
                    hot: []
                },
                showResult: true,
                result: 'index'
            }
        },
        components: {
            Search, Tabbar, TabbarItem, CListView
        },
        methods: {
            getHotData(page){ // 热门搜索词
                app.ajax.get(app.config.api.search.hot, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data && data.length > 1) {
                            this.data.hot = data;
                        }
                    }
                }, (err) => {
                });
            },
            handleSubmit(){
                this.showResult = true;
                app.ajax.post(app.config.api.search.search,
                    {
                        'keyword': this.keyword
                    }, (resp) => {
                        if (resp.status == 200) {
                            let data = resp.data.result;
                            if (data && data.length > 0) {
                                this.result = 'match';
                                this.data.result = data;
                            } else {
                                this.result = 'unMatch';
                            }
                        }
                    }, (err) => {
                    });
            },
            handleFocus(){
                this.showResult = false;
            },
            handleCancel(){
                this.showResult = true;
                this.result = 'index';
            }
        },
        mounted(){
            this.getHotData();
        }
    }
</script>

<style>
    .weui-search-bar {
        background-color: initial;
    }

    .weui-search-bar__box, .weui-search-bar__label {
        background: #EDEDED;
    }

    .search .hot {
        padding-top: 10px;
        padding-left: 10px;
        font-family: PingFangSC-Light;
        font-size: 16px;
    }

    .search .hot .title {
        color: #828181;
    }

    .search .hot .key {
        color: #232121;
        margin-top: 10px;
    }

    .search .hot .key span {
        display: inline-block;
        padding: 5px 15px;
        border: solid 1px #828181;
        border-radius: 20px;
        margin-right: 10px;
    }

    .search .result .match .info {
        font-family: PingFangSC-Light;
        font-size: 15px;
        color: #828181;
        margin: 10px 0px 10px 10px;
        display: inline-block;
    }

    .search .result .unMatch, .search .result .index {
        text-align: center;
        color: #76736C;
        font-size: 14px;
        padding: 50px 0px;
    }
</style>

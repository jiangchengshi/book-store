<template>
    <div class="mall">
        <mt-header :title="title">
            <mt-button icon="more" slot="right"></mt-button>
        </mt-header>
        <header class="mui-bar mui-bar-nav">
            <h1 class="mui-title">{{title}}</h1>
            <a class="mui-pull-right" href="javascript:void(0);" @tap.stop="handleTapSearch">
                <i class="mui-icon iconfont icon-sousuo-sousuo1"></i>
            </a>
        </header>
        <div class="mui-content">
            <Slider :slider="slider"></Slider>
            <!-- 栏目导航 -->
            <div class="navigator">
                <ul class="mui-table-view mui-grid-view mui-grid-9" v-if="data.navigator.length>=5">
                    <li class="mui-table-view-cell">
                        <a @tap.stop="handleTapBookNew">
                            <span class="mui-icon iconfont icon-shuji01" style="background-color: #F9B248;"></span>
                            <div class="mui-media-body">{{data.navigator[0]}}</div>
                        </a>
                    </li>
                    <li class="mui-table-view-cell">
                        <a @tap.stop="handleTapBookFree">
                            <span class="mui-icon iconfont icon-free-font" style="background-color: #72D66D;"></span>
                            <div class="mui-media-body">{{data.navigator[1]}}</div>
                        </a>
                    </li>
                    <li class="mui-table-view-cell">
                        <a @tap.stop="handleTapBookSpecial">
                            <span class="mui-icon iconfont icon-tejia" style="background-color: #FA7B7B;"></span>
                            <div class="mui-media-body">{{data.navigator[2]}}</div>
                        </a>
                    </li>
                    <li class="mui-table-view-cell">
                        <a @tap.stop="handleTapMonthly">
                            <span class="mui-icon iconfont icon-baoyue1" style="background-color: #5FAFF8;"></span>
                            <div class="mui-media-body">{{data.navigator[3]}}</div>
                        </a>
                    </li>
                    <li class="mui-table-view-cell">
                        <a @tap.stop="handleTapSort">
                            <span class="mui-icon iconfont icon-fenlei" style="background-color: #D572F0;"></span>
                            <div class="mui-media-body">{{data.navigator[4]}}</div>
                        </a>
                    </li>
                </ul>
            </div>
            <!-- 推广展示 -->
            <div class="expand" v-if="data.expand.length>=3">
                <div class="left">
                    <span class="title">{{data.expand[0].name}}</span>
                    <span class="intro">{{data.expand[0].desc}}</span>
                    <img :src="data.expand[0].cover">
                </div>
                <div class="right">
                    <div class="recommend">
                        <div>
                            <span class="title">{{data.expand[1].name}}</span>
                            <span class="intro">{{data.expand[1].desc}}</span>
                        </div>
                        <img :src="data.expand[1].cover">
                    </div>
                    <div class="free">
                        <div>
                            <span class="title">{{data.expand[2].name}}</span>
                            <span class="intro">{{data.expand[2].desc}}</span>
                        </div>
                        <img :src="data.expand[2].cover">
                    </div>
                </div>
            </div>
            <!-- 推荐列表 -->
            <div class="recommend">
                <ul class="mui-table-view">
                    <li class="mui-table-view-cell mui-media" v-for="recommend in data.recommend.list">
                        <a href="javascript:void(0);">
                            <img class="mui-media-object mui-pull-left" :src="recommend.image">
                            <div class="mui-media-body">
                                <span class="title">{{recommend.name}}</span>
                                <span class="score">
                                    <i class="mui-icon iconfont icon-star active" v-for="s in recommend.score"></i>
                                    <i class="mui-icon iconfont icon-star" v-for="s in (5-recommend.score)"></i>
                                </span>
                                <p class="mui-ellipsis">{{recommend.intro}}</p>
                                <p class="mui-ellipsis author">{{recommend.author}}</p>
                            </div>
                        </a>
                    </li>
                </ul>
                <div class="mui-card">
                    <div class="mui-media-body">
                        <span>{{data.recommend.card.name}}</span>
                        <p>{{data.recommend.card.desc}}</p>
                    </div>
                    <div class="mui-card-content">
                        <img :src="data.recommend.card.cover" width="100%" height="120px"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Slider from '../components/Slider.vue';

    export default {
        name: 'mall',
        data () {
            return {
                title: '书城',
                slider: {
                    url: app.config.api.focus,
                    width: 0,
                    height: 150
                },
                data: {
                    navigator: [],
                    expand: [],
                    recommend: {
                        list: [],
                        topic: {}
                    }
                }
            }
        },
        components: {
            Slider
        },
        methods: {
            initData(){
                this.getNavigatorData();
                this.getExpandData();
                this.getRecommendData(1);
            },
            getNavigatorData(){
                app.ajax.get(app.config.api.navigator, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.data.navigator = data;
                        }
                    }
                }, (err) => {

                });
            },
            getExpandData(){
                app.ajax.get(app.config.api.recommend2, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.data.expand = data;
                        }
                    }
                }, (err) => {

                });
            },
            getRecommendData(page){
                app.ajax.get(app.config.api.recommend + page, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data && data.length > 0) {
                            this.data.recommend.card = data.pop();
                            this.data.recommend.list = data;
                        }
                    }
                }, (err) => {

                });
            },
            handleTapSearch(){
                this.$router.push({path: 'search'})
            },
            handleTapBookNew(e){
                this.$router.push({path: 'newBook'});
            },
            handleTapBookFree(e){
                this.$router.push({path: 'freeBook'});
            },
            handleTapBookSpecial(e){
                this.$router.push({path: 'specialBook'});
            },
            handleTapMonthly(e){
                this.$router.push({path: 'monthly'});
            },
            handleTapSort(e){
                app.mui.toast('等会再看吧');
            }
        },
        created(){
            // 非全屏显示
            if (app.config.isApp) {
                plus.navigator.setFullscreen(false);
            }

            // 滑动区域宽度
            this.slider.width = app.config.device.screenWidth;

            // 初始化页面数据
            this.initData();
        }
    }
</script>

<style scoped>
    .mall {
        margin: 0;
        padding: 0;
        font-family: PingFangSC-Regular;
    }

    .mall header {
        background-color: white;
    }

    .mall .mui-bar .mui-icon {
        font-size: 20px;
    }

    /*
        navigator
     */
    .mall .mui-content .navigator {
        text-align: center;
    }

    .mall .mui-content .navigator .mui-grid-view.mui-grid-9 {
        background-color: #FFFFFF;
    }

    .mall .mui-content .navigator .mui-grid-view.mui-grid-9 .mui-table-view-cell {
        padding: 5px 21px;
        border: none;
    }

    .mall .mui-content .navigator .iconfont {
        font-size: 16px;
        color: white;
    }

    .mall .mui-content .navigator li a span {
        padding: 6px;
        border-radius: 20px;
    }

    /*
        expand
     */
    .mall .mui-content .expand {
        overflow: hidden;
        border-top: 1px solid #EEECEA;
        border-bottom: 1px solid #EEECEA;
        background-color: #FFFFFF;
    }

    .mall .mui-content .expand .left {
        float: left;
        width: 45%;
        text-align: center;
        padding: 10px;
        border-right: 1px solid #EEECEA;
    }

    .mall .mui-content .expand .left span {
        display: block;
    }

    .mall .mui-content .expand .left .title {
        font-size: 22px;
        color: #EE4D22
    }

    .mall .mui-content .expand .left .intro {
        font-size: 15px;
        color: #BDBCBC;
        padding: 10px 0px;
    }

    .mall .mui-content .expand .left img {
        width: 100px;
        height: 120px;
    }

    .mall .mui-content .expand .right {
        float: left;
        padding-left: 10px;
    }

    .mall .mui-content .expand .right .recommend {
        height: 80px;
        border-bottom: 1px solid #EEECEA;
    }

    .mall .mui-content .expand .right .recommend img {
        width: 70px;
        height: 88px;
        position: relative;
        right: -105px;
        top: -76px;
    }

    .mall .mui-content .expand .right .recommend span {
        display: block;
    }

    .mall .mui-content .expand .right .recommend .title {
        font-size: 22px;
        color: #60AFF7;
        margin-top: 20px;
    }

    .mall .mui-content .expand .right .recommend .intro {
        font-size: 15px;
        color: #BDBCBC;
        padding: 10px 0px;
    }

    .mall .mui-content .expand .right .free {
        height: 80px;
    }

    .mall .mui-content .expand .right .free img {
        width: 70px;
        height: 88px;
        position: relative;
        right: -105px;
        top: -74px;
    }

    .mall .mui-content .expand .right .free span {
        display: block;
    }

    .mall .mui-content .expand .right .free .title {
        font-size: 22px;
        color: #72D66D;
        margin-top: 20px;
    }

    .mall .mui-content .expand .right .free .intro {
        font-size: 15px;
        color: #BDBCBC;
        padding: 10px 0px;
    }

    /*
        recommend
     */
    .mall .mui-content .recommend .mui-card {
        margin: 10px 0px 44px 0px;
        padding: 10px;
    }

    .mall .mui-content .recommend .mui-card span {
        font-size: 16px;
        font-weight: bold;
    }

    .mall .mui-modal a {
        line-height: 44px;
        padding-left: 10px;
    }

    .mall .mui-modal .mui-search input {
        border-radius: 20px;
    }
</style>
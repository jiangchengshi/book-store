<template>
    <div class="shelf-index" :style="{height:height+'px'}">
        <scroller :on-infinite="handleInfinite" :height="height+''">
            <!-- 轮播 -->
            <c-swipe :auto="true" :loop="true" :list="data.swipe"></c-swipe>
            <!-- 栏目导航 -->
            <div class="navigator" v-if="data.navigator.length>=5">
                <a @click="handleNavigator('book/new')">
                    <i class="iconfont icon-shuji01" style="background-color: #F9B248;"></i>
                    <div class="label">{{data.navigator[0]}}</div>
                </a>
                <a @click="handleNavigator('book/free')">
                    <i class="iconfont icon-free-font" style="background-color: #72D66D;"></i>
                    <div class="label">{{data.navigator[1]}}</div>
                </a>
                <a @click="handleNavigator('book/special')">
                    <i class="iconfont icon-tejia" style="background-color: #FA7B7B;"></i>
                    <div class="label">{{data.navigator[2]}}</div>
                </a>
                <a @click="handleNavigator('monthly/list')">
                    <i class="iconfont icon-baoyue1" style="background-color: #5FAFF8;"></i>
                    <div class="label">{{data.navigator[3]}}</div>
                </a>
                <a @click="handleNavigator('classify/list')">
                    <i class="iconfont icon-fenlei" style="background-color: #D572F0;"></i>
                    <div class="label">{{data.navigator[4]}}</div>
                </a>
            </div>
            <!-- 推广展示 -->
            <div class="expand" v-if="data.expand.length>=3">
                <div class="left">
                    <span class="name">{{data.expand[0].name}}</span>
                    <span class="desc">{{data.expand[0].desc}}</span>
                    <img :src="data.expand[0].cover">
                </div>
                <div class="right">
                    <div class="recommend">
                        <span class="name">{{data.expand[1].name}}</span>
                        <span class="desc">{{data.expand[1].desc}}</span>
                        <img :src="data.expand[1].cover">
                    </div>
                    <div class="free">
                        <span class="name">{{data.expand[2].name}}</span>
                        <span class="desc">{{data.expand[2].desc}}</span>
                        <img :src="data.expand[2].cover">
                    </div>
                </div>
            </div>
            <!-- 推荐列表 -->
            <div class="recommend" v-for="(recommend,index) in data.recommend" :key="index">
                <c-list-view type="book" :list="recommend.list" style="margin: 10px 0px;"></c-list-view>
                <card style="padding: 5px;">
                    <div slot="content" style="padding-left: 5px;" @click="handleClickTopic(recommend.topic.id)">
                        <p style="font-size: 14px;line-height: 20px;">{{recommend.topic.name}}</p>
                        <p style="font-size: 12px;color:#828181;">{{recommend.topic.desc}}</p>
                    </div>
                    <img slot="footer" :src="recommend.topic.cover" @click="handleClickTopic(recommend.topic.id)"
                         style="display:block;width: 98%;margin: 5px auto 0px;">
                </card>
            </div>
        </scroller>
    </div>
</template>

<script>
    import {ViewBox, Panel, Card} from 'vux';
    import CSwipe from '../components/Swipe.vue';
    import CListView from '../components/ListView.vue';

    export default {
        data () {
            return {
                height: app.config.setting.height.display - app.config.setting.height.header - app.config.setting.height.tabbar,
                page: 1,
                data: {
                    swipe: [],
                    navigator: [],
                    expand: [],
                    recommend: []
                }
            }
        },
        components: {
            ViewBox, Panel, Card, CSwipe, CListView
        },
        methods: {
            getSwipeData(){ // 轮播数据
                app.ajax.get(app.config.api.focus, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.data.swipe = data.map((item, index) => ({
                                title: item.name,
                                img: item.image,
                                url: ''
                            }));
                        }
                    }
                }, (err) => {
                });
            },
            getNavigatorData(){ // 导航菜单数据
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
            getExpandData(){  // 推广数据
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
            getRecommendData(){ // 推荐数据
                app.ajax.get(app.config.api.recommend + this.page, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data && data.length > 1) {
                            this.data.recommend.push({
                                topic: data.pop(),
                                list: data
                            });
                        }
                    }
                }, (err) => {
                });
            },
            handleNavigator(path){
                this.$router.push({path: path});
            },
            handleClickTopic(id){
                this.$router.push({path: '/mall/topic/detail', query: {id: id}});
            },
            handleInfinite(done){
                if (this.page >= 10) {
                    setTimeout(() => {
                        done(true)
                    }, 1500);
                    return;
                }
                setTimeout(() => {
                    this.getRecommendData();
                    this.page++;
                    setTimeout(() => {
                        done();
                    })
                }, 1500);
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '书城',
                showSearch: true
            });
        },
        mounted(){
            // 获取 轮播图片
            this.getSwipeData();
            // 获取 导航栏目
            this.getNavigatorData();
            // 获取 推广数据
            this.getExpandData();
            // 获取 推荐数据：scroller初始化，加载一次数据
//            this.getRecommendData();
        }
    }
</script>

<style>
    .shelf-index ._v-container{
        top: 46px;
        position: fixed;
    }
    /* navigator */
    .shelf-index .navigator {
        display: flex;
        justify-content: space-around;
        background: #FFFFFF;
    }

    .shelf-index .navigator a {
        text-align: center;
        padding: 15px;
    }

    .shelf-index .navigator .iconfont {
        font-size: 16px;
        color: white;
        border-radius: 20px;
        padding: 5px;
    }

    .shelf-index .navigator .label {
        font-size: 14px;
        margin-top: 8px;
    }

    /* expand */
    .shelf-index .expand {
        overflow: hidden;
        border-top: 1px solid #EEECEA;
        border-bottom: 1px solid #EEECEA;
        background-color: #FFFFFF;
    }

    .shelf-index .expand .left {
        float: left;
        width: 40%;
        text-align: center;
        padding: 10px;
        border-right: 1px solid #EEECEA;
    }

    .shelf-index .expand .left span {
        display: block;
    }

    .shelf-index .expand .left .name {
        font-size: 22px;
        color: #EE4D22
    }

    .shelf-index .expand .left .desc {
        font-size: 15px;
        color: #BDBCBC;
        padding: 10px 0px;
    }

    .shelf-index .expand .left img {
        width: 100px;
        height: 120px;
    }

    .shelf-index .expand .right {
        float: left;
        padding: 5px 10px;
    }

    .shelf-index .expand .right .recommend {
        height: 90px;
        border-bottom: 1px solid #EEECEA;
    }

    .shelf-index .expand .right .recommend img {
        width: 70px;
        height: 88px;
        position: relative;
        right: -105px;
        top: -76px;
    }

    .shelf-index .expand .right .recommend span {
        display: block;
    }

    .shelf-index .expand .right .recommend .name {
        font-size: 22px;
        color: #60AFF7;
        margin-top: 10px;
    }

    .shelf-index .expand .right .recommend .desc {
        font-size: 15px;
        color: #BDBCBC;
        padding: 10px 0px;
    }

    .shelf-index .expand .right .free {
        height: 90px;
    }

    .shelf-index .expand .right .free img {
        width: 70px;
        height: 88px;
        position: relative;
        right: -105px;
        top: -68px;
    }

    .shelf-index .expand .right .free span {
        display: block;
    }

    .shelf-index .expand .right .free .name {
        font-size: 22px;
        color: #72D66D;
        margin-top: 10px;
    }

    .shelf-index .expand .right .free .desc {
        font-size: 15px;
        color: #BDBCBC;
        padding: 10px 0px;
    }
</style>
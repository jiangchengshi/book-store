<template>
    <div class="mall-index" style="height: inherit;">
        <scroller :on-infinite="handleInfinite" :height="height+''" style="top: 46px;">
            <!-- 轮播 -->
            <swiper :auto="true" :loop="true" :list="data.swiper"></swiper>
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
                <div class="left" @click="handleExpand(data.expand[0].id)">
                    <span class="name">{{data.expand[0].name}}</span>
                    <span class="desc">{{data.expand[0].desc}}</span>
                    <img :src="data.expand[0].cover">
                </div>
                <div class="right">
                    <div class="recommend" @click="handleExpand(data.expand[1].id)">
                        <span class="name">{{data.expand[1].name}}</span>
                        <span class="desc">{{data.expand[1].desc}}</span>
                        <img :src="data.expand[1].cover">
                    </div>
                    <div class="free" @click="handleExpand(data.expand[2].id)">
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
                    <div slot="content" style="padding-left: 5px;" @click="handleTopic(recommend.topic.id)">
                        <p style="font-size: 14px;line-height: 20px;">{{recommend.topic.name}}</p>
                        <p style="font-size: 12px;color:#828181;">{{recommend.topic.desc}}</p>
                    </div>
                    <img slot="footer" :src="recommend.topic.cover" @click="handleTopic(recommend.topic.id)"
                         style="display:block;width: 98%;margin: 5px auto 0px;">
                </card>
            </div>
        </scroller>
    </div>
</template>

<script>
    import {Swiper, Panel, Card} from 'vux';
    import CListView from '../components/ListView.vue';

    export default {
        data () {
            return {
                height: app.config.setting.height.display - app.config.setting.height.header - app.config.setting.height.tabbar,
                page: 1,
                data: {
                    swiper: [],
                    navigator: [],
                    expand: [],
                    recommend: []
                }
            }
        },
        components: {
            Swiper, Panel, Card, CListView
        },
        methods: {
            getSwipeData(){ // 轮播数据
                app.ajax.get(app.config.api.focus, {},
                    (data) => {
                        if (data.result && data.result.length > 0) {
                            this.data.swiper = data.result.map((item, index) => ({
                                title: item.name,
                                img: item.image,
                                url: '/mall/book/detail?id=' + item.id
                            }));
                        }
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            getNavigatorData(){ // 导航菜单数据
                app.ajax.get(app.config.api.navigator, {},
                    (data) => {
                        this.data.navigator = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            getExpandData(){  // 推广数据
                app.ajax.get(app.config.api.recommend2, {},
                    (data) => {
                        this.data.expand = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            getRecommendData(callback){ // 推荐数据
                app.ajax.get(app.config.api.recommend + this.page, {},
                    (data) => {
                        if (data.result && data.result.length > 0) {
                            this.data.recommend.push({
                                topic: data.result.pop(),
                                list: data.result
                            });

                            if (typeof callback == "function") {
                                callback();
                            }
                        } else {
                            if (typeof callback == "function") {
                                this.page--;

                                callback(true);
                            }
                        }
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            handleSwiper(id){
                console.log(id);
            },
            handleNavigator(path){
                this.$router.push({path: path});
            },
            handleExpand(id){
                this.$router.push({path: '/mall/book/detail', query: {id: id}});
            },
            handleTopic(id){
                this.$router.push({path: '/mall/topic/detail', query: {id: id}});
            },
            handleInfinite(done){
                if (this.page >= 10) {
                    done(true);
                    return;
                }
                setTimeout(() => {
                    this.page++;

                    this.getRecommendData(done);
                }, 1500);
            }
        },
        created(){
            // 非全屏显示
            if (app.config.setting.isApp) {
                plus.navigator.setFullscreen(false);
            }

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
            // 获取 推荐数据
            this.getRecommendData();
        }
    }
</script>

<style>
    /* navigator */
    .mall-index .navigator {
        display: flex;
        justify-content: space-around;
        background: #FFFFFF;
    }

    .mall-index .navigator a {
        text-align: center;
        padding: 15px;
    }

    .mall-index .navigator .iconfont {
        font-size: 16px;
        color: white;
        border-radius: 20px;
        padding: 5px;
    }

    .mall-index .navigator .label {
        font-size: 14px;
        margin-top: 8px;
    }

    /* expand */
    .mall-index .expand {
        overflow: hidden;
        border-top: 1px solid #EEECEA;
        border-bottom: 1px solid #EEECEA;
        background-color: #FFFFFF;
    }

    .mall-index .expand .left {
        float: left;
        width: 40%;
        text-align: center;
        padding: 10px;
        border-right: 1px solid #EEECEA;
    }

    .mall-index .expand .left span {
        display: block;
    }

    .mall-index .expand .left .name {
        font-size: 22px;
        color: #EE4D22
    }

    .mall-index .expand .left .desc {
        font-size: 15px;
        color: #BDBCBC;
        padding: 10px 0px;
    }

    .mall-index .expand .left img {
        width: 100px;
        height: 120px;
    }

    .mall-index .expand .right {
        float: left;
        padding: 5px 10px;
    }

    .mall-index .expand .right .recommend {
        height: 90px;
        border-bottom: 1px solid #EEECEA;
    }

    .mall-index .expand .right .recommend img {
        width: 70px;
        height: 88px;
        position: relative;
        right: -105px;
        top: -76px;
    }

    .mall-index .expand .right .recommend span {
        display: block;
    }

    .mall-index .expand .right .recommend .name {
        font-size: 22px;
        color: #60AFF7;
        margin-top: 10px;
    }

    .mall-index .expand .right .recommend .desc {
        font-size: 15px;
        color: #BDBCBC;
        padding: 10px 0px;
    }

    .mall-index .expand .right .free {
        height: 90px;
    }

    .mall-index .expand .right .free img {
        width: 70px;
        height: 88px;
        position: relative;
        right: -105px;
        top: -68px;
    }

    .mall-index .expand .right .free span {
        display: block;
    }

    .mall-index .expand .right .free .name {
        font-size: 22px;
        color: #72D66D;
        margin-top: 10px;
    }

    .mall-index .expand .right .free .desc {
        font-size: 15px;
        color: #BDBCBC;
        padding: 10px 0px;
    }
</style>
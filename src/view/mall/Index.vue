<template>
    <div class="shelf-index">
        <!-- 轮播 -->
        <c-swipe :swipe="swipe"></c-swipe>
        <!-- 栏目导航 -->
        <div class="navigator" v-if="data.navigator.length>=5">
            <a @click="handleNavigator('new')">
                <i class="iconfont icon-shuji01" style="background-color: #F9B248;"></i>
                <div class="label">{{data.navigator[0]}}</div>
            </a>
            <a @click="handleNavigator('free')">
                <i class="iconfont icon-free-font" style="background-color: #72D66D;"></i>
                <div class="label">{{data.navigator[1]}}</div>
            </a>
            <a @click="handleNavigator('special')">
                <i class="iconfont icon-tejia" style="background-color: #FA7B7B;"></i>
                <div class="label">{{data.navigator[2]}}</div>
            </a>
            <a @click="handleNavigator('monthly/list')">
                <i class="iconfont icon-baoyue1" style="background-color: #5FAFF8;"></i>
                <div class="label">{{data.navigator[3]}}</div>
            </a>
            <a @click="handleNavigator('classify/index')">
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
        <div class="recommend" v-if="data.recommend.length>0">
            <c-list-view type="book" :list="data.recommend.list" style="margin: 10px 0px;"></c-list-view>
            <card style="padding: 5px">
                <div slot="content" class="card-padding">
                    <p style="font-size: 14px;line-height: 20px;">{{data.recommend.card.name}}</p>
                    <p style="font-size: 12px;color:#828181;">{{data.recommend.card.desc}}</p>
                </div>
                <img slot="footer" :src="data.recommend.card.cover"
                     style="display:block;width: 98%;margin: 5px auto 0px;">
            </card>
        </div>
    </div>
</template>

<script>
    import {ViewBox, Panel, Card} from 'vux';
    import CSwipe from '../components/Swipe.vue';
    import CListView from '../components/ListView.vue';

    export default {
        data () {
            return {
                swipe: {
                    url: app.config.api.focus,
                    auto: true,
                    loop: true
                },
                data: {
                    navigator: [],
                    expand: [],
                    recommend: {
                        length: 0,
                        list: [],
                        topic: {}
                    }
                }
            }
        },
        components: {
            ViewBox, Panel, Card, CSwipe, CListView
        },
        methods: {
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
            getRecommendData(page){ // 推荐数据
                app.ajax.get(app.config.api.recommend + page, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data && data.length > 1) {
                            this.data.recommend.length = data.length;
                            this.data.recommend.card = data.pop();
                            this.data.recommend.list = data;
                        }
                    }
                }, (err) => {
                });
            },
            handleNavigator(path){
                this.$router.push({path: path});
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '书城',
                showSearch: true
            });
        },
        mounted(){
            this.getNavigatorData();
            this.getExpandData();
            this.getRecommendData(1);
        }
    }
</script>

<style>
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
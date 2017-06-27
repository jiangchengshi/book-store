<template>
    <div class="list-view">
        <template v-if="type=='book'">
            <div class="weui-panel weui-panel_access book">
                <a v-for="item in list" :key="item.id" class="weui-media-box weui-media-box_appmsg"
                   @click="clickBook(item.id)">
                    <div class="weui-media-box__hd" v-if="item.image">
                        <img class="weui-media-box__thumb" :src="item.image">
                    </div>
                    <div class="weui-media-box__bd">
                        <h4 class="weui-media-box__title">{{item.name}}</h4>
                        <p class="weui-media-box__score">
                            <rater v-model="item.score" slot="value" disabled :font-size="20"></rater>
                        </p>
                        <p class="weui-media-box__desc">{{item.intro}}</p>
                        <p style="font-size: 15px; color: #828181;">{{item.author}}</p>
                    </div>
                </a>
            </div>
        </template>
        <template v-else-if="type=='monthly'">
            <div class="monthly">
                <group style="margin-top: 10px;">
                    <cell title="超值推荐">
                        <i slot="icon" class="iconfont icon-chaozhilibao"
                           style="color: #f9be10;font-size: 15px;margin-right: 10px;"></i>
                    </cell>
                    <cell v-for="item in list" :key="item.id" :title="item.name" :inline-desc="item.desc"
                          :value="'共'+item.num+'本'" :link="{path: '/mall/monthly/' + link, query: {id: item.id}}"
                          is-link>
                        <div slot="icon">
                            <img :src="item.image[1]"
                                 style="height: 60px;transform: scale3d(0.8,0.8,1);position: relative;left: 0px;box-shadow: 2px 5px 2px #888888;">
                            <img :src="item.image[2]"
                                 style="height: 60px;transform: scale3d(0.8,0.8,1);position: relative;left: -10px;box-shadow: 2px 5px 2px #888888;">
                            <img :src="item.image[0]"
                                 style="height: 60px;transform: scale3d(1,1,1);position: relative;left: -80px;box-shadow: 2px 5px 2px #888888;">
                        </div>
                    </cell>
                </group>
            </div>
        </template>
        <template v-else-if="type=='review'">
            <div class="weui-panel weui-panel_access review">
                <a v-for="item in list" :key="item.id" class="weui-media-box weui-media-box_appmsg" @click="clickReview(item.reviewid)">
                    <div class="weui-media-box__hd" v-if="item.avatar">
                        <img class="weui-media-box__thumb" :src="item.avatar">
                    </div>
                    <div class="weui-media-box__bd">
                        <p class="weui-media-box__title">{{item.ownername}}</p>
                        <p class="weui-media-box__score">
                            <rater v-model="item.score" slot="value" disabled :font-size="20"></rater>
                        </p>
                        <p class="weui-media-box__desc">{{item.content}}</p>
                        <div>
                            <p style="float:left;font-size: 12px;color: #162636;opacity: 0.26;">{{item.addtime}}</p>
                            <p style="float:right;font-size: 12px;color: #EE4D22;">
                                <i class="iconfont icon-dianzan"></i>{{item.goodnum}}
                            </p>
                            <p style="float:right;font-size: 12px;color: #162636;opacity: 0.26; padding-right: 10px;">
                                <i class="iconfont icon-pinglun1"></i>{{item.replies}}
                            </p>
                        </div>
                    </div>
                </a>
            </div>
        </template>
    </div>
</template>

<script>
    import {Group, Cell, Rater} from 'vux';

    export default {
        props: {
            type: String,
            link: String,
            list: Array
        },
        components: {
            Group, Cell, Rater
        },
        methods: {
            clickBook(id){
                this.$router.push({path: '/mall/book/detail', query: {id: id}});
            },
            clickReview(id){
                this.$router.push({path: '/mall/book/review/detail', query: {id: id}});
            }
        }
    }
</script>

<style>
    .list-view .book .weui-media-box_appmsg .weui-media-box__hd {
        height: 75px;
        line-height: 75px;
    }

    .list-view .book .weui-media-box__bd p {
        line-height: 20px;
    }

    .list-view .monthly .weui-cells .weui-cell.vux-tap-active.weui-cell_access .vux-cell-bd.vux-cell-primary {
        margin-left: -50px;
    }

    .list-view .review .weui-media-box {
        padding: 10px 15px;
    }

    .list-view .review .weui-media-box__title {
        font-size: 14px;
    }

    .list-view .review .weui-media-box__bd p {
        line-height: 14px;
    }

    .list-view .review .weui-media-box__desc {
        padding: 10px 0px;
    }

    .list-view .review .iconfont {
        font-size: 14px;
        padding-right: 5px;
    }
</style>

<template>
    <div class="list-view">
        <template v-if="type=='book'">
            <div class="weui-panel weui-panel_access">
                <a v-for="item in list" :key="item.id" class="weui-media-box weui-media-box_appmsg"
                   @click="handleClickBook(item.id)">
                    <div class="weui-media-box__hd" v-if="item.image">
                        <img class="weui-media-box__thumb" :src="item.image">
                    </div>
                    <div class="weui-media-box__bd">
                        <h4 class="weui-media-box__title">{{item.name}}</h4>
                        <p class="weui-media-box__score">
                            <i class="iconfont icon-star" style="font-size: 14px; color: yellow;"
                               v-for="s in item.score"></i>
                            <i class="iconfont icon-star" style="font-size: 14px;" v-for="s in (5-item.score)"></i>
                        </p>
                        <p class="weui-media-box__desc">{{item.intro}}</p>
                        <p style="font-size: 15px; color: #828181;">{{item.author}}</p>
                    </div>
                </a>
            </div>
        </template>
        <template v-else-if="type=='monthly'">
            <group style="margin-top: 10px;">
                <cell title="超值推荐">
                    <i slot="icon" class="iconfont icon-chaozhilibao"
                       style="color: #f9be10;font-size: 15px;margin-right: 10px;"></i>
                </cell>
                <cell v-for="item in list" :key="item.id" :title="item.name" :inline-desc="item.desc"
                      :value="'共'+item.num+'本'" :link="{path: '/mall/monthly/detail', query: {id: item.id}}" is-link>
                    <img slot="icon" :src="item.image" style="width: 50px; height: 60px;margin-right: 15px;">
                </cell>
            </group>
        </template>
        <template v-if="type=='review'">
            <div class="weui-panel weui-panel_access review">
                <a v-for="item in list" :key="item.id" class="weui-media-box weui-media-box_appmsg">
                    <div class="weui-media-box__hd" v-if="item.avatar">
                        <img class="weui-media-box__thumb" :src="item.avatar">
                    </div>
                    <div class="weui-media-box__bd">
                        <p class="weui-media-box__title">{{item.ownername}}</p>
                        <p class="weui-media-box__score">
                            <i class="iconfont icon-star" style="font-size: 12px; color: yellow;"
                               v-for="s in item.score"></i>
                            <i class="iconfont icon-star" style="font-size: 12px;" v-for="s in (5-item.score)"></i>
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
    import {Group, Cell} from 'vux';
    export default {
        props: {
            type: String,
            list: Array
        },
        components: {
            Group, Cell
        },
        methods: {
            handleClickBook(id){
                this.$router.push({path: 'detail', query: {id: id}});
            }
        }
    }
</script>

<style>
    .list-view .weui-media-box_appmsg .weui-media-box__hd {
        height: 75px;
        line-height: 75px;
    }

    .list-view .weui-media-box__bd p {
        line-height: 20px;
    }

    .list-view .review .weui-media-box{
        padding: 10px 15px;
    }

    .list-view .review .weui-media-box__title{
        font-size: 14px;
    }

    .list-view .review .weui-media-box__bd p{
        line-height: 14px;
    }

    .list-view .review .weui-media-box__desc{
        padding: 10px 0px;
    }

    .list-view .review .iconfont {
        font-size: 14px;
        padding-right: 5px;
    }
</style>

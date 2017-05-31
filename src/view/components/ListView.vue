<template>
    <div class="list-view">
        <template v-if="type=='book'">
            <div class="weui-panel weui-panel_access">
                <a v-for="item in list" :key="item.id" class="weui-media-box weui-media-box_appmsg">
                    <div class="weui-media-box__hd" v-if="item.src">
                        <img class="weui-media-box__thumb" :src="item.src" alt="">
                    </div>
                    <div class="weui-media-box__bd">
                        <h4 class="weui-media-box__title">{{item.title}}</h4>
                        <p class="weui-media-box__score">
                            <i class="mui-icon iconfont icon-star active" v-for="s in item.score"></i>
                            <i class="mui-icon iconfont icon-star" v-for="s in (5-item.score)"></i>
                        </p>
                        <p class="weui-media-box__desc">{{item.desc}}</p>
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
        }
    }
</script>

<style>
    .list-view .iconfont {
        font-size: 14px;
    }

    .list-view .weui-media-box_appmsg .weui-media-box__hd {
        height: 75px;
        line-height: 75px;
    }

    .list-view .weui-media-box__bd p {
        line-height: 20px;
    }
</style>

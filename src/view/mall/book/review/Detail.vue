<template>
    <div class="mall-book-review-detail">
        <div class="weui-panel weui-panel_access review">
            <a class="weui-media-box weui-media-box_appmsg">
                <div class="weui-media-box__hd" v-if="review.avatar">
                    <img class="weui-media-box__thumb" :src="review.avatar">
                </div>
                <div class="weui-media-box__bd">
                    <p class="weui-media-box__title">{{review.ownername}}</p>
                    <p class="weui-media-box__score">
                        <rater v-model="review.score" slot="value" disabled :font-size="20"></rater>
                    </p>
                    <p class="weui-media-box__desc">{{review.content}}</p>
                    <div class="remark">
                        <p style="float:left;font-size: 12px;color: #162636;opacity: 0.26;">{{review.addtime}}</p>
                        <p style="float:right;font-size: 12px;color: #EE4D22;">
                            <i class="iconfont icon-dianzan"></i>{{review.goodnum}}
                        </p>
                        <p style="float:right;font-size: 12px;color: #162636;opacity: 0.26; padding-right: 10px;">
                            <i class="iconfont icon-pinglun1"></i>{{review.replies}}
                        </p>
                    </div>
                </div>
            </a>
        </div>
        <div class="weui-panel weui-panel_access review">
            <a v-for="item in review.sublist" :key="item.id" class="weui-media-box weui-media-box_appmsg">
                <div class="weui-media-box__hd" v-if="review.avatar">
                    <img class="weui-media-box__thumb" :src="review.avatar">
                </div>
                <div class="weui-media-box__bd">
                    <p class="weui-media-box__title">{{review.ownername}}</p>
                    <p class="weui-media-box__desc">{{review.addtime}}</p>
                    <p style="float:left;font-size: 12px;color: #162636;opacity: 0.26;">{{review.content}}</p>
                </div>
            </a>
        </div>
        <div style="position: absolute;bottom: 0px;z-index: 501;background: #FFFFFF;height: 53px;" :style="{width:width+'px'}">
            <x-input title="" v-model="content" placeholder="回复楼主">
                <i slot="right" class="iconfont icon-fasong" style="color:#35b4eb;padding-left: 15px;" @click="handleReply"></i>
            </x-input>
        </div>
    </div>
</template>

<script>
    import {XInput, Rater} from 'vux';

    export default {
        data () {
            return {
                width: app.config.setting.width.display,
                review: {},
                content: ''
            }
        },
        components: {
            XInput, Rater
        },
        methods: {
            getData(){
                app.ajax.get(app.config.api.book.review.detail + this.$route.query.id, {},
                    (data) => {
                        this.review = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            handleReply(){
                app.ajax.post(app.config.api.book.review.reply, {
                    uid: this.$store.state.user.uid,
                    reviewid: this.$route.query.id,
                    content: this.content
                }, (data) => {
                    if (data.result.result == 1) {  // 1:成功
                        this.$vux.toast.show({
                            text: '回复成功',
                            type: 'info'
                        });
                    } else if (data.result.result == 2) { // 2:用户不存在
                        this.$vux.toast.show({
                            text: '用户不存在',
                            type: 'warn'
                        });
                    } else if (data.result.result == 3) {   // 3：评论不存在
                        this.$vux.toast.show({
                            text: '评论不存在',
                            type: 'warn'
                        });
                    }
                }, (err) => {
                    this.$vux.toast.show({
                        text: '系统异常，请稍后重试...',
                        type: 'warn'
                    });
                    app.log.error(err);
                });
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '评论详情',
                showBack: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>

<style>
    .mall-book-review-detail .remark .iconfont {
        font-size: 14px;
        padding-right: 5px;
    }

    .mall-book-review-detail .weui-cell__bd.weui-cell__primary{
        background: #F8F8F8;
        border: 1px solid #EDEDED;
        border-radius: 10px;
        height: 30px;
    }
</style>
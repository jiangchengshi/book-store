<template>
    <x-dialog v-model="isShow">
        <template v-if="type=='monthly'">
            <div class="monthly">
                <cell title="订阅超值包月，免费畅读一个月"></cell>
                <div class="weui-panel weui-panel_access">
                    <a class="weui-media-box weui-media-box_appmsg">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" :src="data.image" alt="">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">{{data.name}}
                                <span style="font-size: 12px;color: #989A9C;">({{data.num}}本)</span>
                            </h4>
                            <p class="weui-media-box__desc" style="font-size: 14px;color: #989A9C;">{{data.desc}}</p>
                            <p style="font-size: 12px;color: #989A9C;">原价： ￥
                                <span style="text-decoration: line-through;">1{{data.priceOri}}</span>
                            </p>
                            <p style="font-size: 14px;color: #162636;">现价： ￥
                                <span style="color: red;">2{{data.priceNow}}</span>
                            </p>
                        </div>
                    </a>
                </div>
                <checklist v-model="renew" :options="[{key:data.id, value:'一个月后自动续订'}]" :max="1" :min="0"></checklist>
                <group>
                    <cell title="话费支付">
                        <i slot="icon" class="iconfont icon-iconfontsimqia"
                           style="margin-right: 10px;color: #F9B248;"></i>
                    </cell>
                </group>
                <div style="padding: 5px 0px 15px; text-align: center;">
                    <x-button @click.native="handleCancel"
                              style="width: 45%;border-radius: 30px;background: #989A9C;color: #FFFFFF;">
                        取消支付
                    </x-button>
                    <x-button @click.native="handleConfirm"
                              style="width: 45%;border-radius: 30px; background: #35B4EB;color: #FFFFFF;">
                        确认支付
                    </x-button>
                </div>
            </div>
        </template>
        <template v-else-if="type=='review'">
            <div class="review">
                <group title="发表评论<div class='remark'>至少要给一颗星星</div>">
                    <div class="score" slot="after-title">评分：
                        <rater v-model="review.score"></rater>
                    </div>
                    <x-textarea v-model="review.content" placeholder="随便吐槽两句…"></x-textarea>
                </group>
                <div style="text-align: center;padding: 10px 0px;">
                    <span @click="handleCancel" style="display:inline-block;width: 48%;color: #989A9C;">取消</span>
                    <span @click="handlePublish" style="display:inline-block;width: 48%;color: #989A9C;">发表</span>
                </div>
            </div>
        </template>
    </x-dialog>
</template>

<script>
    import {XDialog, Group, Cell, Checklist, XTextarea, XButton, Rater} from 'vux';

    export default {
        data () {
            return {
                renew: [],
                review: {
                    score: 1,
                    content: ''
                }
            }
        },
        props: ['type', 'show', 'data'],
        components: {
            XDialog, Group, Cell, Checklist, XTextarea, XButton, Rater
        },
        methods: {
            handleCancel(){
                this.$emit('cancel');
            },
            handleConfirm(){
                this.$emit('confirm', this.renew.length > 0 ? true : false);
            },
            handlePublish(){
                this.$emit('publish', this.review);
            }
        },
        computed: {
            isShow(){
                return this.show;
            }
        }
    }
</script>
<style>
    .monthly .weui-media-box_appmsg .weui-media-box__hd {
        height: 75px;
        line-height: 75px;
    }

    .monthly .weui-media-box__bd p {
        line-height: 20px;
    }

    .monthly .weui-cell.weui-check_label .weui-cell__bd {
        color: #989A9C;
        font-size: 14px;
    }

    .review .weui-cells__title {
        text-align: center;
        ont-family: PingFangSC-Regular;
        font-size: 18px;
        color: #162636;
    }

    .review .weui-cells__title .remark {
        opacity: 0.56;
        font-family: PingFangSC-Thin;
        font-size: 12px;
        color: #162636;
        line-height: 20px;
    }

    .review .weui-cells .score {
        padding: 10px 20px;
    }
</style>
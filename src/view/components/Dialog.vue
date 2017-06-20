<template>
    <x-dialog v-model="isShow" hide-on-blur @on-hide="handleCancel">
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
                    <x-button @click.native="handleBuyConfirm"
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
        <template v-else-if="type=='signIn'">
            <div class="sign-in">
                <div style="position: absolute;top: -40px;left:30%;width: 120px;height: 120px;background-color: #FFFFFF;border-radius: 56px;">
                    <img src="../../image/signIn.png" style="width: 120px;height: 120px;">
                </div>
                <div style="text-align: center;margin-top: 100px;">
                    <img src="../../image/signToken.png" style="width: 150px;border-radius: 56px;">
                </div>
                <div style="text-align:center;font-family: PingFangSC-Regular;font-size: 12px;color: #57606A;margin: 20px 0px;">
                    已经连续签到
                    <span style="font-family: PingFangSC-Medium;font-size: 14px;color: #F46F5C;">{{data.continue}}</span>
                    天，今日送您
                    <span style="font-family: PingFangSC-Medium;font-size: 14px;color: #F46F5C;">{{data.number}}</span>
                    书券
                </div>
                <div class="record" v-if="data.list && data.list.length>0" style="color: #FFFFFF;text-align: center;">
                    <div class="item" style="background-color: #35B4EB;">
                        <span class="item-txt">
                            <label v-if="data.list[0]>0">已签</label>
                            <label v-else>未签</label>
                        </span>
                        <span class="item-num">{{data.list[0]}}</span>
                    </div>
                    <div class="item" style="background-color: #FFA300;">
                        <span class="item-txt">
                            <label v-if="data.list[1]>0">已签</label>
                            <label v-else>未签</label>
                        </span>
                        <span class="item-num">{{data.list[1]}}</span>
                    </div>
                    <div class="item" style="background-color: #C0C7CB;">
                        <span class="item-txt">未签</span>
                        <span class="item-num">{{data.list[2]}}</span>
                    </div>
                    <div class="item" style="background-color: #C0C7CB;">
                        <span class="item-txt">未签</span>
                        <span class="item-num">{{data.list[3]}}</span>
                    </div>
                    <div class="item" style="background-color: #C0C7CB;">
                        <span class="item-txt">未签</span>
                        <span class="item-num">{{data.list[4]}}</span>
                    </div>
                </div>
                <div style="text-align: center;padding: 30px 0px;">
                    <span style="display:inline-block;width: 70%;line-height:30px;background: linear-gradient(#FFA300, #fec550);color:#FFFFFF;border-radius: 30px;padding: 5px 0px;"
                          @click="handleSignIn">立即签到</span>
                </div>
            </div>
        </template>
        <template v-else-if="type=='signOk'">
            <div class="sign-ok">
                <div style="position: absolute;top: -40px;left:30%;width: 120px;height: 120px;background-color: #FFFFFF;border-radius: 56px;">
                    <img src="../../image/signOk.png" style="width: 120px;height: 120px;border-radius: 56px;">
                </div>
                <div style="text-align: center;margin-top: 100px;font-family: PingFangSC-Medium;font-size: 18px;color: #57606A;">
                    今日签到成功！
                </div>
                <div style="text-align: center;ont-family: PingFangSC-Regular;font-size: 14px;color: #57606A;margin: 8px 0px;">
                    获得
                </div>
                <div style="text-align:center;font-family: PingFangSC-Regular;font-size: 12px;color: #57606A;margin: 10px 0px;">
                    <span style="font-family: PingFangSC-Semibold;font-size: 50px;color: #EE4D22;">{{data.number}}</span>
                    <span style="font-family: PingFangSC-Regular;font-size: 14px;color: #EE4D22;">书券</span>
                </div>
                <div style="text-align: center;padding: 30px 0px;">
                    <span style="display:inline-block;width: 70%;line-height:30px;background: linear-gradient(#FFA300, #fec550);color:#FFFFFF;border-radius: 30px;padding: 5px 0px;"
                          @click="handleSignOk">查看我的书券</span>
                </div>
            </div>
        </template>
        <template v-else-if="type=='ticketConfirm'">
            <div style="text-align: center;margin: 30px 0px;">
                <img src="../../image/gift.png" style="width: 60px;">
            </div>
            <div style="margin:10px 0px;text-align:center;font-family: PingFangSC-Regular;font-size: 16px;color: #989A9C;">
                您正在对《{{data.name}}》进行{{data.action}}
            </div>
            <div style="margin-bottom:50px;text-align: center;font-family: PingFangSC-Regular;font-size: 18px;color: #57606A;">
                赏金 <label style="color: #EE4D22;">{{data.egold}}</label> 阅币
            </div>
            <x-button action-type="button" @click.native="handleTicketConfirm"
                      style="background: #35B4EB;border-radius: 4px;color: #FFFFFF;">确定
            </x-button>
        </template>
        <template v-else-if="type=='balanceLess'">
            <div style="text-align: center;margin: 30px 0px;">
                <img src="../../image/balance.png" style="width: 60px;">
            </div>
            <div style="margin:10px 0px;text-align:center;font-family: PingFangSC-Regular;font-size: 16px;color: #9FA1A3;">
                账户余额不足了！
            </div>
            <div style="margin-bottom:50px;text-align: center;font-family: PingFangSC-Regular;font-size: 18px;color: #57606A;">
                请充值后进行{{data.action}}
            </div>
            <x-button action-type="button" @click.native="handleRecharge"
                      style="background: #35B4EB;border-radius: 4px;color: #FFFFFF;">立即充值
            </x-button>
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
            handleBuyConfirm(){
                this.$emit('confirm', this.renew.length > 0 ? true : false);
            },
            handlePublish(){
                this.$emit('publish', this.review);
            },
            handleSignIn(){
                this.$emit('signIn');
            },
            handleSignOk(){
                this.$emit('signOk');
            },
            handleTicketConfirm(){
                this.$emit('confirm');
            },
            handleRecharge(){
                this.$router.push({path: '/recharge'})
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

    .sign-in .record .item {
        width: 45px;
        height: 55px;
        border-radius: 4px;
        display: inline-block;
        margin: 0px 2px;
    }

    .sign-in .record .item .item-txt {
        float: left;
        background: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        width: 100%;
        line-height: 20px;
    }

    .sign-in .record .item .item-num {
        float: left;
        margin-left: 10px;
        line-height: 30px;
    }
</style>
<template>
    <x-dialog v-model="isShow" hide-on-blur @on-hide="handleCancel">
        <template v-if="type=='monthly'">
            <div class="monthly">
                <cell title="订阅超值包月，免费畅读一个月" style="border-bottom: 1px solid #BDBDBD;"></cell>
                <group class="info" style="padding-top: 10px;">
                    <cell-box>
                        <div v-if="data.image && data.image.length>0"
                             style="display: inline-block;position: absolute;">
                            <img :src="data.image[1]"
                                 style="height: 80px;transform: scale3d(0.8,0.8,1);position: relative;left: 0px;box-shadow: 2px 5px 2px #888888;">
                            <img :src="data.image[2]"
                                 style="height: 80px;transform: scale3d(0.8,0.8,1);position: relative;left: -10px;box-shadow: 2px 5px 2px #888888;">
                            <img :src="data.image[0]"
                                 style="height: 80px;transform: scale3d(1,1,1);position: relative;left: -100px;box-shadow: 2px 5px 2px #888888;">
                        </div>
                        <div style="display: inline-block;margin-left: 125px;text-align: left;">
                            <p style="font-size: 18px;color: #162636;line-height: 25px;">{{data.name}}
                                <span style="font-size: 12px;color: #989A9C;">({{data.book_num}}本)</span>
                            </p>
                            <p style="font-size: 14px;color: #989A9C;line-height: 25px;width:150px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">
                                {{data.desc}}</p>
                            <p style="font-size: 12px;color: #989A9C;line-height: 30px;">原价： ￥
                                <span style="text-decoration: line-through;">{{data.old_price}}</span>
                            </p>
                            <p style="font-size: 15px;color: #162636;">现价： ￥
                                <span style="color: red;">{{data.price}} /月</span></p>
                        </div>
                    </cell-box>
                </group>
                <checklist v-model="monthly.renew" :options="options.renew" :max="1" :min="0"></checklist>
                <div style="padding: 5px 0px 15px; text-align: center;">
                    <x-button @click.native="handleCancel"
                              style="width: 45%;border-radius: 30px;background: #989A9C;color: #FFFFFF;">
                        取消支付
                    </x-button>
                    <x-button @click.native="handleConfirm('monthly')"
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
                    <span @click="handleConfirm('review')"
                          style="display:inline-block;width: 48%;color: #989A9C;">发表</span>
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
                          @click="handleConfirm('signIn')">立即签到</span>
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
                          @click="handleConfirm('signOk')">查看我的书券</span>
                </div>
            </div>
        </template>
        <template v-else-if="type=='reward'">
            <div class="reward" style="padding: 0px 30px;">
                <div style="text-align: center;margin: 30px 0px;">
                    <img src="../../image/gift.png" style="width: 60px;">
                </div>
                <div style="margin:10px 0px;text-align:center;font-family: PingFangSC-Regular;font-size: 16px;color: #989A9C;">
                    您正在对《{{data.name}}》进行{{data.action}}
                </div>
                <div style="margin-bottom:50px;text-align: center;font-family: PingFangSC-Regular;font-size: 18px;color: #57606A;">
                    赏金 <label style="color: #EE4D22;">{{data.egold}}</label> 阅币
                </div>
                <x-button action-type="button" @click.native="handleConfirm('reward')"
                          style="background: #35B4EB;border-radius: 4px;color: #FFFFFF;margin-bottom: 30px;">确定
                </x-button>
            </div>
        </template>
        <template v-else-if="type=='balance'">
            <div class="balance">
                <div style="text-align: center;margin: 30px 0px;">
                    <img src="../../image/balance.png" style="width: 60px;">
                </div>
                <div style="margin:10px 0px;text-align:center;font-family: PingFangSC-Regular;font-size: 16px;color: #9FA1A3;">
                    账户余额不足了！
                </div>
                <div style="margin-bottom:50px;text-align: center;font-family: PingFangSC-Regular;font-size: 18px;color: #57606A;">
                    请充值后进行{{data.action}}
                </div>
                <x-button action-type="button" @click.native="handleConfirm('balance')"
                          style="background: #35B4EB;border-radius: 4px;color: #FFFFFF;">立即充值
                </x-button>
            </div>
        </template>
        <template v-else-if="type=='note'">
            <div class="note" style="font-family: PingFangSC-Regular;padding: 5px 10px;">
                <div style="font-size: 20px;color: #162636;line-height: 50px;">
                    关于阅币
                </div>
                <div style="font-size: 16px;line-height: 40px;float: left;" v-html="data"></div>
                <x-button action-type="button" @click.native="handleConfirm('note')"
                          style="background: #35B4EB;border-radius: 4px;color: #FFFFFF;">关闭
                </x-button>
            </div>
        </template>
        <template v-else-if="type=='updates'">
            <div class="updates">
                <group :title="data.versionname">
                    <div>
                        {{data.content}}
                    </div>
                </group>
                <div style="text-align: center;padding: 10px 0px;">
                    <span @click="handleCancel" style="display:inline-block;width: 48%;color: #989A9C;">取消</span>
                    <span @click="handleConfirm('updates')"
                          style="display:inline-block;width: 48%;color: #989A9C;">更新</span>
                </div>
            </div>
        </template>
    </x-dialog>
</template>

<script>
    import {XDialog, Group, Cell, CellBox, Checklist, XTextarea, XButton, Rater} from 'vux';

    export default {
        data () {
            return {
                monthly: {
                    renew: ['renew']
                },
                review: {
                    score: 1,
                    content: ''
                },
                options: {
                    renew: [{key: 'renew', value: '一个月后自动续订'}]
                }
            }
        },
        props: ['type', 'show', 'data'],
        components: {
            XDialog, Group, Cell, CellBox, Checklist, XTextarea, XButton, Rater
        },
        methods: {
            handleCancel(){
                this.$emit('cancel');
            },
            handleConfirm(type){
                switch (type) {
                    case 'monthly':
                        this.$emit('confirm', this.monthly.renew.length);
                        break;
                    case 'review':
                        this.$emit('confirm', this.review);
                        break;
                    case 'signIn':
                    case 'signOk':
                    case 'reward':
                    case 'balance':
                    case 'note':
                    case 'updates':
                        this.$emit('confirm');
                        break;
                }
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
    .monthly .info .weui-cells:after {
        border: initial;
    }

    .monthly .weui-cell.weui-check_label .weui-cell__bd {
        color: #989A9C;
        font-size: 14px;
    }

    .monthly .weui-panel:after, .monthly .weui-cells:before {
        border: initial;
    }

    .monthly .weui-media-box {
        padding: 15px 15px 0px;
    }

    .monthly .weui-cell.weui-check_label .weui-cell__bd {
        text-align: left;
    }

    .monthly .weui-cells.vux-no-group-title .weui-cell {
        padding: 5px 15px;
    }

    .monthly .info .vux-cell-box > div {
        padding-right: initial;
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
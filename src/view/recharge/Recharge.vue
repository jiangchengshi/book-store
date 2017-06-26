<template>
    <div class="recharge" :style="{height:height+'px'}">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <group style="margin-top: 10px;">
            <cell :title="money.username" :inline-desc="'余额：'+money.egold+' 阅币'">
                <label style="font-family: PingFangSC-Regular;font-size: 14px;color: #EE4D22;"
                       @click="show.note=true">什么是阅币?</label>
            </cell>
        </group>
        <div class="money" style="padding-top: 10px;">
            <group title="选择充值金额">
                <div style="padding: 10px 0px;font-family: PingFangSC-Light;font-size: 16px;color: #57606A;">
                    <checker v-model="recharge.money" default-item-class="checker-item"
                             selected-item-class="checker-item-selected">
                        <checker-item v-for="(value, key,index) in money.moneys" :key="index" :value="key">
                            <div style="line-height: 30px;margin-top: 10px;">{{value.label}}</div>
                            <div style="line-height: 30px;">售价：{{value.value}}</div>
                        </checker-item>
                    </checker>
                </div>
            </group>
            <x-button action-type="button"
                      style="background: #35B4EB;border-radius: 5px;color: #FFFFFF;margin-top: 15px;"
                      @click.native="show.recharge=true">
                立即充值
            </x-button>
        </div>

        <!-- 什么是阅币 -->
        <c-dialog type="note" :show="show.note" :data="note" @confirm="show.note=false"
                  @cancel="show.note=false"></c-dialog>

        <!-- 充值： -->
        <popup v-model="show.recharge" class="popup-recharge">
            <div style="text-align: center;font-family: PingFangSC-Regular;font-size: 20px;color: #162636;line-height: 50px;border-bottom: solid 1px #EDEDED;">
                充值详情
            </div>
            <group label-margin-right="15px">
                <cell v-if="money.moneys && money.moneys.length>0 && recharge.money>=0" title="充值金额"
                      :value="money.moneys[recharge.money].label" is-link value-align="left"
                      @click.native="show.money=true;show.recharge=false"></cell>
            </group>
            <group title="付款方式" style="padding-top: 10px;">
                <radio :options="options.payType" v-model="recharge.payType">
                    <template scope="props" slot="each-item">
                        <p style="float: left;">
                            <i v-if="props.index==0" class="iconfont icon-weixin-square"
                               style="color: #70e23b;"></i>
                            <i v-else-if="props.index==1" class="iconfont icon-zhifubao-square"
                               style="color: #35b4eb;"></i>
                            <label style="font-family: PingFangSC-Regular;font-size: 16px;color: #162636;line-height: 35px;">
                                &nbsp;&nbsp;{{props.label}}</label>
                        </p>
                    </template>
                </radio>
            </group>
            <div style="font-family: PingFangSC-Regular;color: #162636;padding: 30px 20px 40px">
                <label style="font-size: 20px;">需付款</label>
                <label style="font-size: 24px;float: right;"
                       v-if="money.moneys && money.moneys.length>0 && recharge.money>=0">
                    {{money.moneys[recharge.money].value}}</label>
            </div>
            <x-button type="primary" action-type="button"
                      style="background: #35B4EB;border-radius: 7px;margin-top: 10px;"
                      @click.native="handleRecharge">确定充值
            </x-button>
        </popup>

        <!-- 金额 -->
        <popup v-model="show.money" class="popup-money">
            <div style="text-align: center;font-family: PingFangSC-Regular;font-size: 20px;color: #162636;line-height: 50px;">
                <i style="float: left;padding-left: 10px;" class="iconfont icon-iconjiantou-copy"
                   @click="show.recharge=true;show.money=false;"></i>
                选择金额
                <label style="float: right;padding-right: 10px;font-size: 15px;"
                       @click="show.recharge=true;show.money=false;">确定</label>
            </div>
            <div style="padding:0px 10px 40px 10px;">
                <group style="padding-top: 10px;">
                    <radio :options="options.moneys" v-if="options.moneys && options.moneys.length>0"
                           v-model="recharge.money">
                        <template scope="props" slot="each-item">
                            <div style="float: left;font-family: PingFangSC-Regular;color: #162636;">
                                <div style="font-size:18px;">{{props.label[0]}}</div>
                                <div style="font-size:14px;opacity: 0.56;">售价：{{props.label[1]}}</div>
                            </div>
                        </template>
                    </radio>
                </group>
            </div>
        </popup>
    </div>
</template>

<script>
    import {XHeader, Group, Cell, Checker, CheckerItem, Popup, Radio, XButton} from 'vux';
    import CDialog from '../components/Dialog.vue';

    export default {
        data () {
            return {
                height: app.config.setting.height.display,
                recharge: {
                    money: 0,
                    payType: 'wxpay'
                },
                money: {},
                note: {},
                show: {
                    note: false,
                    recharge: false,
                    money: false
                },
                options: {
                    payType: [{key: 'wxpay', value: '微信支付'}, {key: 'alipay', value: '支付宝支付'}],
                    moneys: []
                }
            }
        },
        components: {
            XHeader, Group, Cell, Checker, CheckerItem, Popup, Radio, XButton, CDialog
        },
        methods: {
            getRechargeData(){
                app.ajax.get(app.config.api.recharge.recharge + this.$store.state.user.uid, {},
                    (data) => {
                        this.money = data.result;

                        // 金额选择列表
                        if (data.result.moneys && data.result.moneys.length > 0) {
                            data.result.moneys.forEach((money, i) => {
                                this.options.moneys.push({
                                    key: i,
                                    value: [money.label, money.value]
                                });
                            });
                        }
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            getNoteData(){
                app.ajax.get(app.config.api.recharge.note, {},
                    (data) => {
                        this.note = data.result.note;
                        // 换行处理
                        this.note = '<p>' + this.note.replace(/\r\n/g, '</p><p>') + '</p>';
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            handleRecharge(){
                app.ajax.post(app.config.api.recharge.recharge, {
                    uid: this.$store.state.user.uid,
                    money: this.money.moneys[this.recharge.money].val / 100,
                    type: this.recharge.payType
                }, (data) => {
                    this.show.recharge = false;

                    if (data.result.result == 1) { // 1:充值成功
                        this.$vux.toast.show({
                            text: '充值成功'
                        });

                        this.getRechargeData();
                    } else if (data.result.result == 2) {   //  2：用户不存在
                        this.$vux.toast.show({
                            text: '用户不存在',
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
                title: '充值中心',
                showBack: true
            });
        },
        mounted(){
            // 充值 参数 信息
            this.getRechargeData();

            // 阅币 信息
            this.getNoteData();
        }
    }
</script>
<style>
    .recharge {
        background: #F8F8F8;
    }

    .recharge .money .checker-item {
        background: #FFFFFF;
        border: 1px solid #57606A;
        border-radius: 8px;
        width: 160px;
        height: 80px;
        text-align: center;
        margin-left: 15px;
        margin-bottom: 10px;
    }

    .recharge .money .checker-item-selected {
        background: #35B4EB;
        border-radius: 8px;
    }

    .recharge .money .weui-cells {
        background-color: initial;
    }

    .recharge .money .weui-cells:before, .recharge .money .weui-cells:after {
        border: initial;
    }

    .recharge .popup-recharge, .recharge .popup-money {
        background: #FFFFFF;
    }

    .recharge .popup-recharge .weui-cells:before {
        border: initial;
    }
</style>
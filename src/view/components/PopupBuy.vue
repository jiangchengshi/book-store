<template>
    <popup class="popup-buy" v-model="isShow" @on-first-show="getData" @on-hide="handleCancel">
        <template v-if="type=='batch'">
            <div class="batch">
                <div style="font-family: PingFangSC-Regular;font-size: 20px;color: #162636;border-bottom: solid 1px #EDEDED;padding: 8px 0px;text-align: center;">
                    章节购买
                </div>
                <div style="font-family: PingFangSC-Regular;font-size: 15px;color: #162636;padding-left: 15px;">您将从第
                    <label style="font-family: PingFangSC-Regular;font-size: 15px;color: #EE4D22;line-height: 40px;">{{input.freecount+1}}</label>
                    章开始购买
                </div>
                <group>
                    <div style="padding-top: 10px;font-family: PingFangSC-Light;font-size: 16px;color: #57606A;">
                        <checker v-model="check.num" default-item-class="checker-item"
                                 selected-item-class="checker-item-selected" @on-change="checkBatchBuyNum">
                            <checker-item value="10">后10章</checker-item>
                            <checker-item value="50">后50章</checker-item>
                            <checker-item value="100">后100章</checker-item>
                            <checker-item value="0">更多章节</checker-item>
                        </checker>
                    </div>
                </group>
                <group>
                    <cell title="当前余额">{{check.egold}} 阅币</cell>
                    <cell title="应付总额">
                        <label style="color: #EE4D22;">{{check.price}} 阅币</label>
                    </cell>
                </group>
                <div style="padding: 20px 0px 10px;">
                    <div style="opacity: 0.35;font-family: PingFangSC-Light;font-size: 10px;color: #162636;padding: 5px;">
                        1、批量购买章节是付费章节,如期间有免费章节和购买章节,下载时将一并下载
                    </div>
                    <div style="opacity: 0.35;font-family: PingFangSC-Light;font-size: 10px;color: #162636;padding: 5px;">
                        2、免费章节及已购买章节不会重复扣费,请放心购买。
                    </div>
                </div>
                <x-button type="primary" action-type="button"
                          style="background: #35B4EB;border-radius: 2px;margin-top: 10px;"
                          @click.native="confirmBatchBuy">
                    确定购买
                </x-button>
            </div>
        </template>
        <template v-else-if="type=='batchInput'">
            <div class="batch-input">
                <div style="font-family: PingFangSC-Regular;font-size: 20px;color: #162636;border-bottom: solid 1px #EDEDED;padding: 8px 0px;text-align: center;">
                    <i style="float: left;padding-left: 10px;" class="iconfont icon-iconjiantou-copy"
                       @click="inputBack"></i>
                    批量购买
                </div>
                <div class="buyNum" style="padding: 10px 0px 40px 10px;">
                <span style="display: block;font-family: PingFangSC-Regular;font-size: 15px;color: #162636;padding-bottom: 10px;">
                    购买章节数：
                </span>
                    <x-input v-model="input.num" placeholder="输入想要购买的章节数" @on-change="inputBatchBuyNum"></x-input>
                    <span style="display: block;font-family: PingFangSC-Regular;font-size: 15px;color: #162636;float: right;padding-right: 15px;">
                    剩余：<label>{{input.vipcount}}</label> 章
                </span>
                </div>
                <group>
                    <cell title="当前余额">{{input.egold}} 阅币</cell>
                    <cell title="应付总额">
                        <label style="color: #EE4D22;">{{input.price}} 阅币</label>
                    </cell>
                </group>
                <div style="padding: 20px 0px 10px;">
                    <div style="opacity: 0.35;font-family: PingFangSC-Light;font-size: 10px;color: #162636;padding: 5px;">
                        1、其中免费的10章，不会重复扣费
                    </div>
                </div>
                <x-button type="primary" action-type="button"
                          style="background: #35B4EB;border-radius: 2px;margin-top: 10px;"
                          @click.native="confirmBatchBuy">
                    确定购买
                </x-button>
            </div>
        </template>
        <template v-else-if="type=='catalog'">
            <div style="text-align: center;font-family: PingFangSC-Regular;font-size: 20px;color: #162636;line-height: 50px;">
                购买 {{catalog.articlename}}
            </div>
            <div style="padding:0px 10px;">
                <group style="padding-top: 10px;font-family: PingFangSC-Regular;color: #162636;">
                    <cell-box>
                        <label style="font-size: 15px;opacity: 0.56;display:inline-block;width: 70px;">章节价格</label>
                        <label style="font-size: 17px;">{{catalog.saleprice}} 阅币</label>
                    </cell-box>
                    <cell-box is-link link="/recharge">
                        <label style="font-size: 15px;opacity: 0.56;display:inline-block;width: 70px;">余额</label>
                        <label style="font-size: 17px;color: #EE4D22;">{{$store.state.user.egold}} 阅币</label>
                        <label style="font-size:12px;color: #35B4EB;position: absolute;right: 35px;top: 12px;">充值</label>
                    </cell-box>
                </group>
                <checklist v-model="catalog.autoBuy" :options="catalog.options" :max="1" :min="0"></checklist>
                <x-button action-type="button" @click.native="confirmBuy"
                          style="background: #35B4EB;border-radius: 4px;color: #FFFFFF;margin-top:20px;margin-bottom: 10px;">
                    确定购买
                </x-button>
            </div>
        </template>
    </popup>
</template>

<script>
    import {Group, Cell, CellBox, XButton, Checker, CheckerItem, Checklist, XInput, Popup} from 'vux';

    export default {
        data () {
            return {
                check: {
                    num: 0,
                    price: 0,
                    options: [],
                    egold: 0,
                    saleprice: 0
                },
                input: {
                    num: 0,
                    price: 0,
                    egold: 0,
                    saleprice: 0,
                    freecount: 0,
                    vipcount: 0,
                },
                catalog: {
                    articlename: '',
                    saleprice: 0,
                    autoBuy: ['autoBuy'],
                    options: [{key: 'autoBuy', value: '自动订阅下一章并不再提示'}]
                }
            }
        },
        props: {
            type: {
                type: String,
                required: true
            },
            show: {
                type: Boolean,
                required: true
            },
            data: {
                type: Object
            }
        },
        components: {
            Group, Cell, CellBox, XButton, Checker, CheckerItem, Checklist, XInput, Popup
        },
        computed: {
            isShow(){
                return this.show;
            }
        },
        methods: {
            getData(){
                if (this.type == "batch") {
                    this.getBatchData();
                } else if (this.type == "batchInput") {
                    this.getBatchInputData();
                } else if (this.type == "catalog") {
                    this.getCatalogData();
                }
            },
            getBatchData(){
                app.ajax.get(app.config.api.chapter.batch.option + this.$route.query.id + "/" + this.$store.state.user.uid, {},
                    (data) => {
                        Object.assign(this.check, data.result);
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            getBatchInputData(){
                app.ajax.get(app.config.api.chapter.batch.price + this.$store.state.user.uid + "/" + this.$route.query.id, {},
                    (data) => {
                        Object.assign(this.input, data.result);
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            getCatalogData(callback){
                Object.assign(this.catalog, this.data);
            },
            handleCancel(){
                this.$emit('cancel');
            },
            checkBatchBuyNum(){
                this.check.price = this.check.saleprice * this.check.num;
                this.$emit('checkBatchBuyNum', this.check.num);
            },
            inputBatchBuyNum(){
                this.input.price = this.input.saleprice * this.input.num;
                this.$emit('inputBatchBuyNum', this.input.num);
            },
            inputBack(){
                this.$emit('inputBack');
            },
            confirmBuy(){
                if (this.type == "batch" || this.type == "batchInput") {
                    this.$emit('confirmBatchBuy');
                } else if (this.type == "catalog") {
                    let autoBuy = this.catalog.autoBuy.length > 0 ? 1 : 2;

                    // 存储到localstorage
                    app.util.localStorage(app.config.storage.autoBuy, autoBuy);

                    this.$emit('confirmCatalogBuy', autoBuy);
                }
            }
        },
        mounted(){
            this.autoBuy = app.util.localStorage(app.config.storage.autoBuy) == 1 ? ['autoBuy'] : [];
        }
    }
</script>
<style>
    .popup-buy {
        background: #FFFFFF;
    }

    .popup-buy .batch .weui-cells:before {
        border: initial;
    }

    .popup-buy .batch .checker-item {
        background: #FFFFFF;
        border: 1px solid #C1CDD6;
        border-radius: 8px;
        width: 160px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin-left: 15px;
        margin-bottom: 10px;
    }

    .popup-buy .batch .checker-item-selected {
        background: #35B4EB;
        border-radius: 8px;
    }

    .popup-buy .batch-input .weui-input {
        border: 1px solid #C1CDD6;
        border-radius: 8px;
        height: 40px;
    }

    .popup-buy .batch-input .buyNum .weui-cell:before {
        border: initial;
    }

    .popup-buy .batch-input .buyNum .vux-x-input.weui-cell .weui-cell__bd .weui-input {
        padding-left: 10px;
    }
</style>
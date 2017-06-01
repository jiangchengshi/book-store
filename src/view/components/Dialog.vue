<template>
    <x-dialog v-model="isShow">
        <template v-if="type=='monthly'">
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
    </x-dialog>
</template>

<script>
    import {XDialog, Group, Cell, Checklist, XButton} from 'vux';

    export default {
        data () {
            return {
                renew: []
            }
        },
        props: ['type', 'show', 'data'],
        components: {
            XDialog, Group, Cell, Checklist, XButton
        },
        methods: {
            handleCancel(){
                this.$emit('cancel');
            },
            handleConfirm(){
                this.$emit('confirm');
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
    .weui-media-box_appmsg .weui-media-box__hd {
        height: 75px;
        line-height: 75px;
    }

    .weui-media-box__bd p {
        line-height: 20px;
    }

    .weui-cell.weui-check_label .weui-cell__bd {
        color: #989A9C;
        font-size: 14px;
    }
</style>
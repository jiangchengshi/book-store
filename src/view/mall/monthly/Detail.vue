<template>
    <div class="mall-monthly-detail">
        <group>
            <cell :title="detail.name" :inline-desc="detail.desc"
                  :value="'共'+detail.num+'本'" :link="{path: '/mall/monthly/package', query: {id: detail.id}}"
                  is-link>
                <div slot="icon" v-if="detail.image && detail.image.length>0">
                    <img :src="detail.image[1]"
                         style="height: 60px;transform: scale3d(0.8,0.8,1);position: relative;left: 0px;box-shadow: 2px 5px 2px #888888;">
                    <img :src="detail.image[2]"
                         style="height: 60px;transform: scale3d(0.8,0.8,1);position: relative;left: -10px;box-shadow: 2px 5px 2px #888888;">
                    <img :src="detail.image[0]"
                         style="height: 60px;transform: scale3d(1,1,1);position: relative;left: -80px;box-shadow: 2px 5px 2px #888888;">
                </div>
            </cell>
            <cell v-if="detail.endtime==0" style="font-size: 15px;">
                <slot>
                    <x-button type="primary" plain mini @click.native="handleBuy">订购</x-button>
                </slot>
            </cell>
            <cell v-else :title="detail.endtime+' 到期'" style="font-size: 15px;">
                <slot>
                    <x-button type="primary" plain mini @click.native="handleBuy">续订</x-button>
                </slot>
            </cell>
        </group>
        <c-list-view type="monthly" link="package" :list="dataList"></c-list-view>

        <!-- 订购/续订 -->
        <c-dialog type="monthly" :show="show.buy" :data="detail" @confirm="confirmBuy"
                  @cancel="show.buy=false"></c-dialog>
    </div>
</template>

<script>
    import {XHeader, Group, Cell, XButton,dateFormat } from 'vux';
    import CListView from '../../components/ListView.vue';
    import CDialog from '../../components/Dialog.vue';

    export default {
        data () {
            return {
                detail: {},
                dataList: [],
                show: {
                    buy: false,
                    charges: false
                }
            }
        },
        components: {
            XHeader, Group, Cell, XButton, CListView, CDialog
        },
        methods: {
            getDetailData(){
                app.ajax.get(app.config.api.monthly.info + this.$route.query.id + "/" + this.$store.state.user.uid, {},
                    (data) => {
                        this.detail = data.result;

                        // 若已购买，则格式化到期时间
                        if(this.detail.endtime>0){
                            this.detail.endtime = dateFormat(this.detail.endtime, 'YYYY-MM-DD');
                        }
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            getListData(){
                app.ajax.get(app.config.api.monthly.monthly, {},
                    (data) => {
                        this.dataList = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            handleBuy(e){
                this.show.buy = true;
            },
            confirmBuy(renew){
                let _this = this;

                app.ajax.post(app.config.api.monthly.buy, {
                    uid: this.$store.state.user.uid,
                    baoid: this.$route.query.id,
                    autobuy: renew
                }, (data) => {
                    this.show.buy = false;

                    if (data.result.result == 1) { // 1：成功
                        this.$vux.alert.show({
                            title: '系統提示',
                            content: '恭喜阁下，订阅成功!',
                            onHide(){
                                _this.getDetailData();
                            }
                        });
                    } else if (data.result.result == 2) {   // 2:用户不存在
                        this.$vux.toast.show({
                            text: '用户不存在',
                            type: 'warn'
                        });
                    } else if (data.result.result == 3) {   //  3:包不存在
                        this.$vux.toast.show({
                            text: '包不存在',
                            type: 'warn'
                        });
                    } else if (data.result.result == 4) {   //  4:用户余额不足
                        this.$vux.alert.show({
                            title: '系統提示',
                            content: '用户余额不足',
                            buttonText: '去充值',
                            onHide(){
                                _this.$router.push({path: '/recharge'});
                            }
                        });
                    } else if (data.result.result == 5) {   //  5：已经购买过了
                        this.$vux.toast.show({
                            text: '已经购买过了',
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
                title: '超值包月',
                showBack: true,
                showSearch: true
            });
        },
        mounted(){
            this.getDetailData();
            this.getListData();
        }
    }
</script>
<style>
    .mall-monthly-detail .weui-cells .weui-cell.vux-tap-active.weui-cell_access .vux-cell-bd.vux-cell-primary {
        margin-left: -50px;
    }

    .mall-monthly-detail .weui-panel .weui-media-box__bd {
        text-align: left;
        margin-left: 20px;
    }
</style>
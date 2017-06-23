<template>
    <div class="mall-monthly-detail">
        <group>
            <cell :title="monthly.name" :inline-desc="monthly.desc"
                  :value="'共'+monthly.book_num+'本'" :link="{path: '/mall/monthly/package', query: {id: monthly.id}}"
                  is-link>
                <div slot="icon">
                    <img :src="monthly.image[0]"
                         style="height: 60px;transform: scale3d(0.8,0.8,1);position: relative;left: 0px;box-shadow: 2px 5px 2px #888888;">
                    <img :src="monthly.image[2]"
                         style="height: 60px;transform: scale3d(0.8,0.8,1);position: relative;left: -10px;box-shadow: 2px 5px 2px #888888;">
                    <img :src="monthly.image[1]"
                         style="height: 60px;transform: scale3d(1,1,1);position: relative;left: -80px;box-shadow: 2px 5px 2px #888888;">
                </div>
            </cell>
            <cell v-if="monthly.endtime==0" style="font-size: 15px;">
                <slot>
                    <x-button type="primary" plain mini @click.native="handleBuy">订购</x-button>
                </slot>
            </cell>
            <cell v-else :title="monthly.endtime+' 到期'" style="font-size: 15px;">
                <slot>
                    <x-button type="primary" plain mini @click.native="handleBuy">续订</x-button>
                </slot>
            </cell>
            <x-switch title="到期自动续订" v-model="renew" style="font-size: 15px;"></x-switch>
        </group>
        <c-list-view type="monthly" link="package" :list="dataList"></c-list-view>

        <!-- 订购/续订 -->
        <c-dialog type="monthly" :show="show.buy" :data="monthly" @confirm="handleConfirm"
                  @cancel="show.buy=false"></c-dialog>
    </div>
</template>

<script>
    import {XHeader, Group, Cell, XButton, XSwitch} from 'vux';
    import CListView from '../../components/ListView.vue';
    import CDialog from '../../components/Dialog.vue';

    export default {
        data () {
            return {
                monthly: {},
                dataList: [],
                renew: true,
                show: {
                    buy: false
                }
            }
        },
        components: {
            XHeader, Group, Cell, XButton, XSwitch, CListView, CDialog
        },
        methods: {
            getDetailData(){
                app.ajax.get(app.config.api.monthly.monthly + this.$route.query.id, {},
                    (data) => {
                        this.monthly = data.result;
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
            handleConfirm(renew){
                // 订阅 包月包
                this.renew = renew;

                app.ajax.post(app.config.api.monthly.buy, {
                    uid: this.$store.state.user.uid,
                    baoid: this.$route.query.id,
                    autobuy: this.renew
                }, (data) => {
                    if (data.result.result == 1) { // 1：成功
                        this.$vux.toast.show({
                            text: '订阅成功',
                            type: 'info'
                        });
                        this.show.buy = false;
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
                    } else if (data.result.result == 3) {   //  4:用户余额不足
                        this.$vux.toast.show({
                            text: '用户余额不足',
                            type: 'warn'
                        });
                    } else if (data.result.result == 3) {   //  5：已经购买过了
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
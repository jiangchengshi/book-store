<template>
    <div class="mall-monthly-detail">
        <group>
            <cell :title="monthly.name" :inline-desc="monthly.desc"
                  :value="'共'+monthly.num+'本'" :link="{path: '/mall/monthly/package', query: {id: monthly.id}}" is-link>
                <img slot="icon" :src="monthly.image" style="width: 50px; height: 60px;margin-right: 15px;">
            </cell>
            <cell title="2016-12-30到期" style="font-size: 15px;">
                <slot>
                    <x-button type="primary" plain mini @click.native="handleOrder">{{monthly.isvip==1?'续订':'订购'}}
                    </x-button>
                </slot>
            </cell>
            <x-switch title="到期自动续订" v-model="renew" style="font-size: 15px;"></x-switch>
        </group>
        <c-list-view type="monthly" link="package" :list="dataList"></c-list-view>
        <c-dialog type="monthly" :show="show.dialog" :data="monthly" @confirm="handleConfirm"
                  @cancel="show.dialog=false"></c-dialog>
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
                    dialog: false
                }
            }
        },
        components: {
            XHeader, Group, Cell, XButton, XSwitch, CListView, CDialog
        },
        methods: {
            getDetailData(){
                app.ajax.get(app.config.api.monthly.info + this.$route.query.id, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.monthly = data;
                        }
                    }
                }, (err) => {
                });
            },
            getListData(){
                app.ajax.get(app.config.api.monthly.monthly, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.dataList = data;
                        }
                    }
                }, (err) => {
                });
            },
            handleOrder(e){
                this.show.dialog = true;
            },
            handleConfirm(renew){
                // 订阅 包月包
                console.log('续订：' + renew);
                this.renew = renew;

                this.show.dialog = false;
                this.$vux.toast.show({
                    text: '订阅成功',
                    isShowMask: true
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
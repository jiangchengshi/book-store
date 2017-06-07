<template>
    <div class="mall-monthly-detail">
        <group>
            <cell :title="monthly.name" :inline-desc="monthly.desc"
                  :value="'共'+monthly.num+'本'" :link="{path: '/mall/monthly/package', query: {id: monthly.id}}" is-link>
                <img slot="icon" :src="monthly.image" style="width: 50px; height: 60px;margin-right: 15px;">
            </cell>
            <cell title="2016-12-30到期" style="font-size: 15px;">
                <slot>
                    <x-button type="primary" plain mini>{{monthly.isvip==1?'续订':'订购'}}</x-button>
                </slot>
            </cell>
            <x-switch title="到期自动续订" v-model="renew" style="font-size: 15px;"></x-switch>
        </group>
        <c-list-view type="monthly" link="package" :list="dataList"></c-list-view>
    </div>
</template>

<script>
    import {XHeader, Group, Cell, XButton, XSwitch} from 'vux';
    import CListView from '../../components/ListView.vue';

    export default {
        data () {
            return {
                monthly: {},
                dataList: [],
                renew: true
            }
        },
        components: {
            XHeader, Group, Cell, XButton, XSwitch, CListView
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
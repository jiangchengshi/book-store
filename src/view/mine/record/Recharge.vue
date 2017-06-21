<template>
    <div class="mine-recharge">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <group style="margin-top: 10px;">
            <cell :title="recharge.username" :inline-desc="'余额：'+recharge.egold">
                <x-button action-type="button" style="background-color: #35B4EB;color: #FFFFFF;">充值</x-button>
            </cell>
        </group>
        <div v-if="recharge.logs && recharge.logs.length>0">
            <div v-for="(log, key, index) in recharge.logs" :key="index">
                <group :title="key+'月'">
                    <cell :title="detail.paytype" :inline-desc="detail.buytime" v-for="(detail, index) in log"
                          :key="index">
                        <label style="font-family: PingFangSC-Medium;font-size: 18px;color: #86C764;">{{detail.egold}}</label>
                        <label style="color: #86C764;">元</label>
                    </cell>
                </group>
            </div>
        </div>
        <div v-else style="text-align: center;margin-top: 40px;">
            <img src="../../../image/unMatch.png" width="80px">
            <div>对不起，暂无新记录！</div>
        </div>
    </div>
</template>

<script>
    import {XHeader, Group, Cell, XButton} from 'vux';

    export default {
        data () {
            return {
                recharge: {}
            }
        },
        components: {
            XHeader, Group, Cell, XButton
        },
        methods: {
            getData(){
                app.ajax.get(app.config.api.mine.recharge + this.$store.state.user.uid, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.recharge = data;
                        }
                    }
                }, (err) => {

                });
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '充值记录',
                showBack: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>
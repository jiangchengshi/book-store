<template>
    <div class="mine-recharge">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <group style="margin-top: 10px;">
            <cell :title="recharge.username" :inline-desc="'余额：'+recharge.egold+' 阅币'">
                <x-button action-type="button" style="background-color: #35B4EB;color: #FFFFFF;"
                          @click.native="handleRecharge">充值
                </x-button>
            </cell>
        </group>
        <div v-if="recharge.logs instanceof Array" style="text-align: center;margin-top: 40px;">
            <img src="../../../image/unMatch.png" width="80px">
            <div>对不起，暂无新记录！</div>
        </div>
        <div v-else>
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
    </div>
</template>

<script>
    import {XHeader, Group, Cell, XButton} from 'vux';

    export default {
        data () {
            return {
                recharge: {
                    username: '',
                    egold: 0
                }
            }
        },
        components: {
            XHeader, Group, Cell, XButton
        },
        methods: {
            getData(){
                app.ajax.get(app.config.api.mine.recharge + this.$store.state.user.uid, {},
                    (data) => {
                        this.recharge = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            handleRecharge(){
                this.$router.push({path: '/recharge'});
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
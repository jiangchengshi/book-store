<template>
    <div class="mine-recharge">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <div v-if="consume instanceof Array" style="text-align: center;margin-top: 40px;">
            <img src="../../../image/unMatch.png" width="80px">
            <div>对不起，暂无新记录！</div>
        </div>
        <div v-else>
            <div v-for="(con, key, index) in consume" :key="index">
                <group :title="key+'月'">
                    <cell :title="detail.articlename" :inline-desc="detail.buytime" v-for="(detail, index) in con"
                          :key="index">
                        <label style="font-family: PingFangSC-Medium;font-size: 18px;color: #EE4D22;">{{detail.price}}</label>
                        <label style="color: #EE4D22;">阅币</label>
                    </cell>
                </group>
            </div>
        </div>
    </div>
</template>

<script>
    import {XHeader, Group, Cell} from 'vux';

    export default {
        data () {
            return {
                consume: {}
            }
        },
        components: {
            XHeader, Group, Cell
        },
        methods: {
            getData(){
                app.ajax.get(app.config.api.mine.consume + this.$store.state.user.uid, {},
                    (data) => {
                        this.consume = data.result;
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
                title: '消费记录',
                showBack: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>
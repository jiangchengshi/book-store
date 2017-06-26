<template>
    <div class="mine-token">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <div>
            <group style="padding-top: 10px;">
                <cell title="可用书券总额：" value-align="left" style="font-size: 15px;">
                    <label style="font-size: 16px;color: #f19028;">{{egold}} 书券</label>
                </cell>
            </group>
            <group title="书券说明">
                <cell title="1、书券是什么?">
                    <label slot="inline-desc">书券是由聚阅发行的代阅券....</label>
                </cell>
                <cell title="2、如何获取书券?">
                    <label slot="inline-desc">目前书券只能通过聚阅Android和IOS APP获得....</label>
                </cell>
            </group>
        </div>
    </div>
</template>

<script>
    import {XHeader, Group, Cell} from 'vux';

    export default {
        data () {
            return {
                egold: 0
            }
        },
        components: {
            XHeader, Group, Cell
        },
        methods:{
            getUserData(){
                app.ajax.get(app.config.api.mine.info + this.$store.state.user.uid, {},
                    (data) => {
                        this.egold = data.result.egold;
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
                title: '我的书券',
                showBack: true
            });
        },
        mounted(){
            this.getUserData();
        }
    }
</script>

<style scoped>
    .main {
        margin: 0;
        padding: 0;
    }
</style>
<template>
    <div class="recharge">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <div :style="{height:height+'px'}">
        {{msg}}
        </div>
    </div>
</template>

<script>
    import {XHeader} from 'vux';

    export default {
        data () {
            return {
                height: app.config.setting.height.display - app.config.setting.height.header,
                msg: '抱歉：充值功能暂未开放'
            }
        },
        components: {
            XHeader
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '充值中心',
                showBack: true
            });
        }
    }
</script>
<style>
    .recharge {
        background: #F8F8F8;
    }
</style>
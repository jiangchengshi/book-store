<template>
    <div class="sign">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <div style="background: #F8F8F8;" :style="{height: height+'px', width: width+'px'}">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import {XHeader} from 'vux';

    export default {
        name: 'sign',
        data(){
            return {
                width: app.config.setting.width.screen,
                height: app.config.setting.height.sign
            }
        },
        components: {
            XHeader
        }
    }
</script>
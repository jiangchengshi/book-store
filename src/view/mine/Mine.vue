<template>
    <div class="mine" style="background: #F8F8F8;" :style="{height: height+'px', width: width+'px'}">
        <router-view></router-view>
        <tabbar>
            <tabbar-item link="/mall">
                <span slot="icon"><i class="iconfont icon-shuchengxuanzhong"></i></span>
                <span slot="label">书城</span>
            </tabbar-item>
            <tabbar-item link="/search">
                <span slot="icon"><i class="iconfont icon-sousuo2"></i></span>
                <span slot="label">搜索</span>
            </tabbar-item>
            <tabbar-item link="/shelf">
                <span slot="icon"><i class="iconfont icon-bookshelf"></i></span>
                <span slot="label">书架</span>
            </tabbar-item>
            <tabbar-item link="/mine" selected>
                <span slot="icon"><i class="iconfont icon-wode1"></i></span>
                <span slot="label">我的</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>

<script>
    import {Tabbar, TabbarItem} from 'vux';

    export default {
        data () {
            return {
                width: app.config.setting.width.display,
                height: app.config.setting.height.display - app.config.setting.height.tabbar
            }
        },
        components: {
            Tabbar, TabbarItem
        }
    }
</script>
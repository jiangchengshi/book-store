<template>
    <div class="mine" style="background: #F8F8F8;overflow: scroll;" :style="{height: height+'px', width: width+'px'}">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                width: app.config.setting.width.display,
                height: app.config.setting.height.display
            }
        }
    }
</script>
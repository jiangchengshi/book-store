<template>
    <swiper auto :height="height+'px'" @on-index-change="goToIndex">
        <swiper-item><img src="../image/guide1.png" :style="{height:height+'px'}"></swiper-item>
        <swiper-item><img src="../image/guide2.png" :style="{height:height+'px'}"></swiper-item>
        <swiper-item><img src="../image/guide3.png" :style="{height:height+'px'}" @click="handleClick"></swiper-item>
    </swiper>
</template>

<script>
    import {Swiper, SwiperItem} from "vux";

    export default {
        data () {
            return {
                width: app.config.setting.width.screen,
                height: app.config.setting.height.screen
            }
        },
        components: {
            Swiper, SwiperItem
        },
        methods: {
            goToIndex(index){
                if (index == 2) {
                    // 设置welcome状态为1
                    app.util.localStorage(app.config.storage.welcome, 1);

                    // 跳转
                    setTimeout(() => {
                        this.$router.push({path: '/'});
                    }, 1000);
                }
            },
            handleClick(e){
                if ((this.height - e.y) < app.config.setting.height.tabbar) {
                    this.goToIndex(2);
                }
            }
        },
        created(){
            // 全屏显示
            if (app.config.setting.isApp) {
                plus.navigator.setFullscreen(true);
            }
        }
    }
</script>

<style>
    .item-logo {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .item-logo a {
        width: 200px;
        height: 200px;
        display: block;
        border: 1px solid #FFFFFF;
        text-align: center;
        line-height: 200px;
        border-radius: 50%;
        font-size: 40px;
        color: #fff;
        position: absolute;
        top: 15%;
        left: 50%;
        margin-left: -100px;
    }

    .animate {
        position: absolute;
        left: 0;
        bottom: 15%;
        width: 100%;
        color: #fff;
        display: -moz-box;
    }

    .animate h2 {
        text-align: center;
        margin-bottom: 20px;
    }

    .animate li {
        width: 50%;
        height: 30px;
        line-height: 30px;
        list-style: none;
        font-size: 16px;
        text-align: right;
    }

    .animate li:nth-child(3) {
        text-align: left;
        float: right;
    }

    .animate button {
        position: absolute;
        width: 160px;
        left: 50%;
        margin-left: -80px;
        bottom: 15%;
        padding: 10px;
        color: #fff;
        border-color: #fff;
    }
</style>
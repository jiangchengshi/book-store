<template>
    <div ref="welcome">
        <slider ref="slider" :width="width+'px'" :height="height+'px'" :interval="3000" :speed="600" :auto="true"
                :control-btn="false" animation="fade">
            <slider-item>
                <div class="item-logo" style="background-color: #02C1ED;">
                    <a href="#">BOOK</a>
                    <div id="slider-1" class="animate">
                        <h2>小巧高能</h2>
                        <li>几十K的JS和CSS</li>
                        <li>上百种控件样式和模板</li>
                    </div>
                </div>
            </slider-item>
            <slider-item>
                <div class="item-logo" style="background-color: #67C962;">
                    <a href="#">BOOK</a>
                    <div id="slider-2" class="animate">
                        <h2>流畅体验</h2>
                        <li>下拉刷新、转场动画</li>
                        <li>整个世界都流畅了</li>
                    </div>
                </div>
            </slider-item>
            <slider-item>
                <div class="item-logo" style="background-color: #FCD208;">
                    <a href="#">BOOK</a>
                    <div class="animate">
                        <button class="mui-btn mui-btn-warning mui-btn-outlined" @tap.stop="handleTapExpr">立即体验
                        </button>
                    </div>
                </div>
            </slider-item>
        </slider>
    </div>
</template>

<script>
    import {Slider, SliderItem} from 'vue-easy-slider';

    export default {
        data () {
            return {
                width: 0,
                height: 0
            }
        },
        components: {
            Slider,
            SliderItem
        },
        methods: {
            handleTapExpr(e){
                // 设置 started
                app.service.setStartFlag();

                this.$router.push({path: 'shelf'});
            },
            handleSwipeLeft(e){
                console.log(this.$refs.slider.next());
            },
            handleSwipeRight(e){
                console.log(this.$refs.slider.prev());
            }
        },
        created(){
            this.width = app.config.device.screenWidth;
            this.height = app.config.device.screenHeight;
        },
        mounted(){
            // 监听手势滑动
            this.$refs.welcome.addEventListener('swipeleft', this.handleSwipeLeft);
            this.$refs.welcome.addEventListener('swiperight', this.handleSwipeRight);
        }
    }
</script>

<style scoped>
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
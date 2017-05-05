<template>
    <div class="main">
        <div class="mui-slider mui-fullscreen" style="background-color: black;">
            <div class="mui-slider-group">
                <!-- 第一张 -->
                <div class="mui-slider-item">
                    <div class="item-logo" style="background-color: #D74B28">
                        <a href="#">
                            MUI
                        </a>
                        <div class="animate guide-show">
                            <h2 class="animated bounceInDown">小巧高能</h2>
                            <li class="animated bounceInLeft">几十K的JS和CSS</li>
                            <li class="animated bounceInRight">上百种控件样式和模板</li>
                        </div>
                    </div>
                </div>
                <!-- 第二张 -->
                <div class="mui-slider-item">
                    <div class="item-logo" style="background-color: #02C1ED;">
                        <a href="#">
                            MUI
                        </a>
                        <div id="tips-2" class="animate mui-hidden">
                            <h2 class="animated bounceInDown">原生UI</h2>
                            <li class="animated bounceInLeft">以iOS原生UI为基础</li>
                            <li class="animated bounceInRight">补充Android特有样式</li>
                        </div>
                    </div>
                </div>
                <!-- 第三张 -->
                <div class="mui-slider-item">
                    <div class="item-logo" style="background-color: #67C962;">
                        <a href="#">
                            MUI
                        </a>
                        <div id="tips-3" class="animate mui-hidden">
                            <h2 class="animated bounceInDown">流畅体验</h2>
                            <li class="animated bounceInLeft">下拉刷新、转场动画</li>
                            <li class="animated bounceInRight">整个世界都流畅了</li>
                        </div>
                    </div>
                </div>
                <!-- 第四张 -->
                <div class="mui-slider-item">
                    <div class="item-logo" style="background-color: #FCD208;">
                        <a href="#">
                            MUI
                        </a>
                        <div class="animate">
                            <button id='close' class="mui-btn mui-btn-warning mui-btn-outlined">立即体验</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mui-slider-indicator">
                <div class="mui-indicator mui-active"></div>
                <div class="mui-indicator"></div>
                <div class="mui-indicator"></div>
                <div class="mui-indicator"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>

<style scoped>
    .main {
        margin: 0;
        padding: 0;
    }
</style>
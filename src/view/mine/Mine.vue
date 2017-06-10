<template>
    <div class="mine" style="background: #F8F8F8;" :style="{height: height+'px', width: width+'px'}">
        <div style="background: #FFFFFF;text-align: center;padding: 55px 0px 35px 0px;">
            <img :src="info.avatar" style="width: 60px;height: 60px;">
            <a style="color:#35B4EB; display: block;" @click="handleSignIn">{{info.username}}</a>
        </div>
        <div class="info" style="text-align: center;background: #F8F8F8;padding: 10px 0px;">
            <div style="position:relative; display: flex;justify-content: space-around;margin-bottom: 10px;">
                <a>
                    <span>阅币</span>
                    <div><label>{{info.egold}}</label></div>
                </a>
                <a>
                    <span>书券</span>
                    <div><label>{{info.goodnum}}</label></div>
                </a>
                <a>
                    <span>连续签到</span>
                    <div><label>{{info.continue}}</label> 天</div>
                </a>
            </div>
            <x-button action-type="button" :plain="true">充值</x-button>
        </div>
        <group>
            <cell title="充值记录" is-link>
                <i slot="icon" class="iconfont icon-chongzhi" style="color: #9ed18b;"></i>
            </cell>
            <cell title="充值记录" is-link>
                <i slot="icon" class="iconfont icon-xiaofeijilu" style="color: #f5ce8e;"></i>
            </cell>
            <cell title="充值记录" is-link>
                <i slot="icon" class="iconfont icon-dashang1" style="color: #f393af;"></i>
            </cell>
        </group>
        <group>
            <cell title="我的评论" is-link>
                <i slot="icon" class="iconfont icon-pinglun" style="color: #66c9f3;"></i>
            </cell>
            <cell title="我的消息" is-link>
                <i slot="icon" class="iconfont icon-icon066" style="color: #f6cf8f;"></i>
            </cell>
            <cell title="意见反馈" is-link>
                <i slot="icon" class="iconfont icon-yijianfankui" style="color: #d9b4fb;"></i>
            </cell>
        </group>
        <group>
            <cell title="设置" is-link>
                <i slot="icon" class="iconfont icon-chaozhidijia-01" style="color: #8e9397;"></i>
            </cell>
        </group>
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
    import {Group, Cell, XButton, Tabbar, TabbarItem} from 'vux';

    export default {
        data () {
            return {
                width: app.config.setting.width.screen,
                height: app.config.setting.height.screen,
                info: {
                    username: '登录',
                    avatar: '',
                    egold: 0,
                    goodnum: 0,
                    continue: 0
                }
            }
        },
        components: {
            Group, Cell, XButton, Tabbar, TabbarItem
        },
        methods: {
            getUserData(){
                app.ajax.get(app.config.api.user.info + this.$store.state.user.uid, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.info = data;
                        }
                    }
                }, (err) => {

                });
            },
            handleSignIn(){
                this.$router.push({path: '/sign'})
            }
        },
        mounted(){
            if (this.$store.state.user.uid > 0) {
                this.getUserData();
            }
        }
    }
</script>

<style>
    .mine div img {
        /* 更好支持border-radius */
        border-top-left-radius: 999px; /* 左上角 */
        border-top-right-radius: 999px; /* 右上角 */
        border-bottom-right-radius: 999px; /* 右下角 */
        border-bottom-left-radius: 999px; /* 左下角 */
        border-radius: 999px;
        /*background-color: #ccc;*/
        /*background-clip: padding-box;*/
    }

    .mine .info div span {
        font-size: 14px;
        color: #989A9C;
    }

    .mine .info div label {
        font-family: PingFangSC-Semibold;
        font-size: 20px;
        color: #162636;
    }

    .mine .weui-cell__hd {
        padding-right: 10px;
    }

    .mine .weui-cells.vux-no-group-title {
        margin-bottom: 6px;
    }

    .mine .weui-btn.weui-btn_default.weui-btn_plain-default {
        line-height: 25px;
        width: 60%;
    }

    .mine .weui-cell.vux-tap-active.weui-cell_access {
        padding: 5px 15px;
    }
</style>
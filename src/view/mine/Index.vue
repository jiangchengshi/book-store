<template>
    <div class="mine-index">
        <div style="background: #FFFFFF;text-align: center;padding: 46px 0px 22px 0px;">
            <img :src="info.avatar" style="width: 60px;height: 60px;" @click="handleInfo">
            <a style="color:#35B4EB; display: block;" @click="handleLogin">{{info.username}}</a>
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
            <x-button action-type="button" :plain="true" @click.native="handleRecharge">充值</x-button>
        </div>
        <div>
            <group>
                <cell title="充值记录" is-link link="/mine/record/recharge">
                    <i slot="icon" class="iconfont icon-chongzhi" style="color: #9ed18b;"></i>
                </cell>
                <cell title="消费记录" is-link link="/mine/record/consume">
                    <i slot="icon" class="iconfont icon-xiaofeijilu" style="color: #f5ce8e;"></i>
                </cell>
                <cell title="打赏记录" is-link link="/mine/record/reward">
                    <i slot="icon" class="iconfont icon-dashang1" style="color: #f393af;"></i>
                </cell>
            </group>
            <group>
                <cell title="我的评论" is-link link="/mine/review">
                    <i slot="icon" class="iconfont icon-pinglun" style="color: #66c9f3;"></i>
                </cell>
                <cell title="我的消息" is-link link="/mine/news">
                    <i slot="icon" class="iconfont icon-icon066" style="color: #f6cf8f;"></i>
                </cell>
                <cell title="意见反馈" is-link link="/feedback">
                    <i slot="icon" class="iconfont icon-yijianfankui" style="color: #d9b4fb;"></i>
                </cell>
            </group>
            <group>
                <cell title="设置" is-link link="/setting">
                    <i slot="icon" class="iconfont icon-chaozhidijia-01" style="color: #8e9397;"></i>
                </cell>
            </group>
        </div>
        <tabbar>
            <tabbar-item link="/mall/index">
                <span slot="icon"><i class="iconfont icon-shuchengxuanzhong"></i></span>
                <span slot="label">书城</span>
            </tabbar-item>
            <tabbar-item link="/search">
                <span slot="icon"><i class="iconfont icon-sousuo2"></i></span>
                <span slot="label">搜索</span>
            </tabbar-item>
            <tabbar-item link="/shelf/index">
                <span slot="icon"><i class="iconfont icon-bookshelf"></i></span>
                <span slot="label">书架</span>
            </tabbar-item>
            <tabbar-item link="/mine/index" selected>
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
                app.ajax.get(app.config.api.mine.info + this.$store.state.user.uid, {},
                    (data) => {
                        this.info = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            handleInfo(){
                this.$router.push({path: '/mine/info'});
            },
            handleLogin(){
                if (this.$store.state.user.uid <= 0) {
                    this.$router.push({path: '/entry/login'});
                    return;
                }
            },
            handleRecharge(){
                this.$router.push({path: '/recharge'});
            }
        },
        mounted(){
            this.getUserData();
        }
    }
</script>

<style>
    .mine-index div img {
        /* 更好支持border-radius */
        border-top-left-radius: 999px; /* 左上角 */
        border-top-right-radius: 999px; /* 右上角 */
        border-bottom-right-radius: 999px; /* 右下角 */
        border-bottom-left-radius: 999px; /* 左下角 */
        border-radius: 999px;
        /*background-color: #ccc;*/
        /*background-clip: padding-box;*/
    }

    .mine-index .info div span {
        font-size: 14px;
        color: #989A9C;
    }

    .mine-index .info div label {
        font-family: PingFangSC-Semibold;
        font-size: 20px;
        color: #162636;
    }

    .mine-index .weui-cell__hd {
        padding-right: 10px;
    }

    .mine-index .weui-cells.vux-no-group-title {
        margin-bottom: 6px;
    }

    .mine-index .weui-btn.weui-btn_default.weui-btn_plain-default {
        line-height: 32px;
        width: 60%;
        background: #F8F8F8;
        border: 1px solid #989A9C;
        border-radius: 7px;
        color: #989A9C;
        font-size: 15px;
    }

    .mine-index .weui-cell.vux-tap-active.weui-cell_access {
        padding: 3px 15px;
    }
</style>
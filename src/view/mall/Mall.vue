<template>
    <div class="mall">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
            <router-link to="/search" slot="right">
                <i v-show="$store.state.header.showSearch" class="iconfont icon-sousuo_sousuo"></i>
            </router-link>
            <span slot="right" v-show="$store.state.header.showShare" class="iconfont icon-zuihouyibanfenxiang"
                  @click="show.share=true"></span>
            <span slot="right" v-show="$store.state.header.showReview" @click="show.review=true">发表评论</span>
        </x-header>
        <div style="overflow: scroll;" :style="{height: height+'px', width: width+'px'}">
            <router-view></router-view>
        </div>
        <tabbar>
            <tabbar-item link="/mall/index" selected>
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
            <tabbar-item link="/mine/index">
                <span slot="icon"><i class="iconfont icon-wode1"></i></span>
                <span slot="label">我的</span>
            </tabbar-item>
        </tabbar>

        <!-- 发表评论 -->
        <popup v-model="show.share" class="popup-share" @on-first-show="getShareData">
            <group>
                <cell-box>
                    <div :style="{width:(width-30)+'px'}" style="padding:5px 0px;text-align: center;">
                        <div v-for="(share, index) in shareList" :key="index"
                             style="display: inline-block;margin: 0px 10px;">
                            <img :src="share.img">
                            <div style="font-family: PingFangSC-Light;font-size: 12px;color: #989A9C;">
                                {{share.name}}
                            </div>
                        </div>
                    </div>
                </cell-box>
            </group>
            <group>
                <x-button action-type="button" style="background: #FFFFFF;" @click.native="show.share=false;">取消</x-button>
            </group>
        </popup>

        <!-- 评论 -->
        <c-dialog type="review" :show="show.review" @confirm="publishReview"
                  @cancel="show.review=false"></c-dialog>
    </div>
</template>

<script>
    import {XHeader, Tabbar, TabbarItem, Popup, Group, CellBox, XButton} from 'vux';
    import CDialog from '../components/Dialog.vue';

    export default {
        name: 'mall',
        data(){
            return {
                width: app.config.setting.width.display,
                height: app.config.setting.height.display - app.config.setting.height.header - app.config.setting.height.tabbar,
                show: {
                    share: false,
                    review: false
                },
                shareList: []
            }
        },
        components: {
            XHeader, Tabbar, TabbarItem, Popup, Group, CellBox, XButton,CDialog
        },
        methods: {
            getShareData(){
                app.ajax.get(app.config.api.share, {},
                    (data) => {
                        this.shareList = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            publishReview(review){
                app.ajax.post(app.config.api.book.review.add, {
                    uid: this.$store.state.user.uid,
                    articleid: this.$route.query.id,
                    score: review.score,
                    content: review.content
                }, (data) => {
                    if (data.result.result == 1) {  // 1:成功
                        this.show.review = false;
                        this.$vux.toast.show({
                            text: '发表成功',
                            type: 'info'
                        });
                    } else if (data.result.result == 2) {   // 2:用户不存在
                        this.$vux.toast.show({
                            text: '用户不存在',
                            type: 'warn'
                        });
                    } else if (data.result.result == 3) {   // 3：书籍不存在
                        this.$vux.toast.show({
                            text: '书籍不存在',
                            type: 'warn'
                        });
                    }
                }, (err) => {
                    this.$vux.toast.show({
                        text: '系统异常，请稍后重试...',
                        type: 'warn'
                    });
                    app.log.error(err);
                });
            },
            handleSearch(){
                this.$router.push({path: '/search'})
            }
        }
    }
</script>

<style>
    .mall {
        background: #F8F8F8;
    }
</style>
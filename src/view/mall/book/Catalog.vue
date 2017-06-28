<template>
    <div class="catalog">
        <scroller :on-infinite="handleInfinite" :height="height+''" style="top: 46px;">
            <group>
                <cell v-for="(catalog, index) in dataList" :key="index" @click.native="clickCatalog(catalog)">
                <span slot="title"
                      :class="{free:catalog.isvip==0||(catalog.isvip==1&&catalog.is_buy==1), vip:(catalog.isvip==1&&catalog.is_buy==0)}">
                    {{catalog.chaptername}}
                </span>
                    <i v-if="catalog.isvip==1&&catalog.is_buy==0" class="iconfont icon-lock"
                       style="font-size: 16px;"></i>
                </cell>
            </group>
        </scroller>

        <!-- 章节购买 -->
        <c-popup-buy type="catalog" :show="show.buy" :data="catalog" @confirmBuy="confirmBuy"></c-popup-buy>
    </div>
</template>

<script>
    import {Group, Cell} from 'vux';
    import CPopupBuy from '../../components/PopupBuy.vue';

    export default {
        data () {
            return {
                height: app.config.setting.height.display - app.config.setting.height.header,
                page: 1,
                dataList: [],
                show: {
                    buy: false
                },
                catalog: {},
            }
        },
        components: {
            Group, Cell, CPopupBuy
        },
        methods: {
            getData(callback){
                app.ajax.get(app.config.api.chapter.catalog + this.$route.query.id + '/' + this.page + '/' + this.$store.state.user.uid, {},
                    (data) => {
                        if (data.result.result && data.result.result.length > 0) {
                            this.dataList = this.dataList.concat(data.result.result);

                            if (typeof callback == "function") {
                                callback();
                            }
                        } else {
                            if (typeof callback == "function") {
                                this.page--;

                                callback(true);
                            }
                        }
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            clickCatalog(catalog){
                if (catalog.isvip == 1 && catalog.is_buy == 0) {
                    this.catalog = catalog;
                    this.show.buy = true;
                } else {
                    this.showChapter(catalog.chapterid);
                }
            },
            confirmBuy(autoBuy){
                app.ajax.post(app.config.api.chapter.buy, {
                    uid: this.$store.state.user.uid,
                    chapterid: this.catalog.chapterid,
                    autobuy: autoBuy
                }, (data) => {
                    this.show.buy = false;

                    if (data.result.result == 1) { // 1：成功
                        // 是否自动购买
                        app.util.localStorage("autoBuy", autoBuy);

                        this.showChapter(this.catalog.chapterid);
                    } else if (data.result.result == 2) {   // 2:用户不存在
                        this.$vux.toast.show({
                            text: '用户不存在',
                            type: 'warn'
                        });
                    } else if (data.result.result == 3) {   //  3:章节不存在
                        this.$vux.toast.show({
                            text: '章节不存在',
                            type: 'warn'
                        });
                    } else if (data.result.result == 4) {   //  4:不是付费章节
                        this.$vux.toast.show({
                            text: '不是付费章节',
                            type: 'warn'
                        });
                    } else if (data.result.result == 5) {   //  5:用户余额不足
                        this.$vux.alert.show({
                            title: '系統提示',
                            content: '用户余额不足',
                            buttonText: '去充值',
                            onHide(){
                                _this.$router.push({path: '/recharge'});
                            }
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
            showChapter(chapterId){
                this.$router.push({path: '/reader', query: {id: this.$route.query.id, chapterId: chapterId}});
            },
            handleInfinite(done){
                if (this.page >= 10) {
                    done(true);
                    return;
                }
                setTimeout(() => {
                    this.page++;

                    this.getData(done);
                }, 1500);
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '目录',
                showBack: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>

<style>
    .catalog .free {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #162636;
    }

    .catalog .vip {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #989A9C;
    }

    .catalog .popup-buy {
        background: #FFFFFF;
    }

    .catalog .popup-buy .weui-cell__bd {
        opacity: 0.26;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #162636;
    }
</style>
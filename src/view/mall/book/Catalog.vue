<template>
    <div class="catalog">
        <group>
            <cell v-for="(catalog, index) in dataList" :key="index" @click.native="clickCatalog(catalog)">
                <span slot="title"
                      :class="{vip:(catalog.isvip==1&&catalog.is_buy==0), free:!catalog.isvip==0||(catalog.isvip==1&&catalog.is_buy==1)}">
                    {{catalog.articlename}}
                </span>
                <i v-if="catalog.isvip==1&&catalog.is_buy==0" class="iconfont icon-lock" style="font-size: 16px;"></i>
            </cell>
        </group>

        <!-- 章节购买 -->
        <popup v-model="show.buy" class="popup-buy">
            <div style="text-align: center;font-family: PingFangSC-Regular;font-size: 20px;color: #162636;line-height: 50px;">
                购买 {{catalog.articlename}}
            </div>
            <div style="padding:0px 10px;">
                <group style="padding-top: 10px;font-family: PingFangSC-Regular;color: #162636;">
                    <cell-box>
                        <label style="font-size: 15px;opacity: 0.56;display:inline-block;width: 70px;">章节价格</label>
                        <label style="font-size: 17px;">{{catalog.saleprice}} 阅币</label>
                    </cell-box>
                    <cell-box is-link link="/recharge">
                        <label style="font-size: 15px;opacity: 0.56;display:inline-block;width: 70px;">余额</label>
                        <label style="font-size: 17px;color: #EE4D22;">{{$store.state.user.egold}} 阅币</label>
                        <label style="font-size:12px;color: #35B4EB;position: absolute;right: 35px;top: 12px;">充值</label>
                    </cell-box>
                </group>
                <checklist v-model="autoBuy" :options="options.autoBuy" :max="1" :min="0"></checklist>
                <x-button action-type="button" @click.native="confirmBuy"
                          style="background: #35B4EB;border-radius: 4px;color: #FFFFFF;margin-top:20px;margin-bottom: 10px;">
                    确定购买
                </x-button>
            </div>
        </popup>
    </div>
</template>

<script>
    import {Group, Cell, CellBox, Checklist, XButton, Popup} from 'vux';

    export default {
        data () {
            return {
                page: 1,
                dataList: [],
                chapterId: {
                    min: 0,
                    max: 0
                },
                show: {
                    buy: false
                },
                catalog: {},
                autoBuy: ['autoBuy'],
                options: {
                    autoBuy: [{key: 'autoBuy', value: '自动订阅下一章并不再提示'}]
                }
            }
        },
        components: {
            Group, Cell, CellBox, Checklist, XButton, Popup
        },
        methods: {
            getData(){
                app.ajax.get(app.config.api.reader.chapters + this.$route.query.id + '/' + this.page + '/' + this.$store.state.user.uid, {},
                    (data) => {
                        this.chapterId.min = data.result.min_chapterid;
                        this.chapterId.max = data.result.max_chapterid;
                        this.dataList = data.result.result;
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
                }else{
                    this.showChapter(catalog.chapterid);
                }
            },
            confirmBuy(){
                app.ajax.post(app.config.api.buy.chapter, {
                    uid: this.$store.state.user.uid,
                    chapterid: this.catalog.chapterid,
                    autobuy: this.autoBuy.length > 0 ? 1 : 2
                }, (data) => {
                    this.show.buy = false;

                    if (data.result.result == 1) { // 1：成功
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
                this.$router.push({path:'/reader', query:{id: this.$route.query.id, chapterId: chapterId}});
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
    .catalog .vip {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #162636;
    }

    .catalog .free {
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
<template>
    <div class="mall-monthly-package">
        <group>
            <cell-box>
                <div v-if="detail.image && detail.image.length>0" style="display: inline-block;">
                    <img :src="detail.image[1]"
                         style="height: 80px;transform: scale3d(0.8,0.8,1);position: relative;left: 0px;box-shadow: 2px 5px 2px #888888;">
                    <img :src="detail.image[2]"
                         style="height: 80px;transform: scale3d(0.8,0.8,1);position: relative;left: -10px;box-shadow: 2px 5px 2px #888888;">
                    <img :src="detail.image[0]"
                         style="height: 80px;transform: scale3d(1,1,1);position: relative;left: -100px;box-shadow: 2px 5px 2px #888888;">
                </div>
                <div style="display: inline-block;margin-left: -50px;">
                    <p style="font-size: 18px;color: #162636;line-height: 25px;">{{detail.name}}
                        <span style="font-size: 12px;color: #989A9C;">({{detail.book_num}}本)</span>
                    </p>
                    <p style="font-size: 14px;color: #989A9C;line-height: 25px;">{{detail.desc}}</p>
                    <p style="font-size: 12px;color: #989A9C;line-height: 30px;">原价： ￥
                        <span style="text-decoration: line-through;">{{detail.old_price}}</span>
                    </p>
                    <p style="font-size: 15px;color: #162636;">现价： ￥
                        <span style="color: red;">{{detail.price}} /月</span></p>
                </div>
            </cell-box>
        </group>
        <group style="margin-bottom: 10px;">
            <x-button v-if="detail.endtime==0" type="primary"
                      style="background: #35B4EB;border-radius: 7px;color: #FFFFFF;margin: 8px 20px; width: 90%;"
                      @click.native="handleBuy">立即订阅
            </x-button>
            <template v-else>
                <cell :title="detail.endtime+' 到期'" style="font-size: 15px;">
                    <slot>
                        <x-button type="primary" plain mini @click.native="handleBuy">续订</x-button>
                    </slot>
                </cell>
            </template>
        </group>
        <c-list-view type="book" :list="dataList"></c-list-view>

        <!-- 订购/续订 -->
        <c-dialog type="monthly" :show="show.buy" :data="detail" @confirm="confirmBuy"
                  @cancel="show.buy=false"></c-dialog>
    </div>
</template>

<script>
    import {Group, Cell, CellBox, XButton, dateFormat} from 'vux';
    import CListView from '../../components/ListView.vue';
    import CDialog from '../../components/Dialog.vue';

    export default {
        data () {
            return {
                detail: {},
                dataList: [],
                renew: true,
                show: {
                    buy: false,
                    charges: false
                }
            }
        },
        components: {
            Group, Cell, CellBox, XButton, CListView, CDialog
        },
        methods: {
            getData(){
                app.ajax.get(app.config.api.monthly.monthly + this.$route.query.id + "/" + this.$store.state.user.uid, {},
                    (data) => {
                        if (data.result.booklist && data.result.booklist.length > 0) {
                            this.dataList = data.result.booklist.map((book) => {
                                return {
                                    id: book.articleid,
                                    name: book.articlename,
                                    author: book.author,
                                    image: book.image,
                                    intro: book.intro,
                                    score: book.score
                                }
                            });
                        }
                        this.detail = data.result;

                        // 若已购买，则格式化到期时间
                        if (this.detail.endtime > 0) {
                            this.detail.endtime = dateFormat(this.detail.endtime, 'YYYY-MM-DD');
                        }

                        this.$store.commit('updateHeader', {
                            title: data.result.name,
                            showBack: true,
                            showSearch: true
                        });
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            handleBuy(e){
                this.show.buy = true;
            },
            confirmBuy(renew){
                let _this = this;

                app.ajax.post(app.config.api.monthly.buy, {
                    uid: this.$store.state.user.uid,
                    baoid: this.$route.query.id,
                    autobuy: renew
                }, (data) => {
                    this.show.buy = false;

                    if (data.result.result == 1) { // 1：成功
                        this.$vux.alert.show({
                            title: '系統提示',
                            content: '恭喜阁下，订阅成功!',
                            onHide(){
                                _this.getData();
                            }
                        });
                    } else if (data.result.result == 2) {   // 2:用户不存在
                        this.$vux.toast.show({
                            text: '用户不存在',
                            type: 'warn'
                        });
                    } else if (data.result.result == 3) {   //  3:包不存在
                        this.$vux.toast.show({
                            text: '包不存在',
                            type: 'warn'
                        });
                    } else if (data.result.result == 4) {   //  4:用户余额不足
                        this.$vux.toast.show({
                            text: '用户余额不足',
                            type: 'warn'
                        });
                    } else if (data.result.result == 5) {   //  5：已经购买过了
                        this.$vux.toast.show({
                            text: '已经购买过了',
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
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '加载中...',
                showBack: true,
                showSearch: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>

<style>
    .mall-monthly-package .weui-media-box_appmsg .weui-media-box__hd {
        height: 75px;
        line-height: 75px;
    }

    .mall-monthly-package .weui-media-box__bd p {
        line-height: 20px;
    }

    .mall-monthly-package .vux-cell-box > div {
        padding-right: initial;
    }
</style>

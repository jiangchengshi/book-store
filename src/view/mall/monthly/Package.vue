<template>
    <div class="mall-monthly-package">
        <div class="weui-panel weui-panel_access">
            <a class="weui-media-box weui-media-box_appmsg">
                <div class="weui-media-box__hd">
                    <img class="weui-media-box__thumb" :src="monthly.image">
                </div>
                <div class="weui-media-box__bd">
                    <h4 class="weui-media-box__title">{{monthly.name}}
                        <span style="font-size: 12px;color: #989A9C;">({{monthly.book_num}}本)</span>
                    </h4>
                    <p class="weui-media-box__desc" style="font-size: 14px;color: #989A9C;">{{monthly.desc}}</p>
                    <p style="font-size: 12px;color: #989A9C;">原价： ￥
                        <span style="text-decoration: line-through;">{{monthly.old_price}}</span>
                    </p>
                    <p style="font-size: 14px;color: #162636;">现价： ￥
                        <span style="color: red;">{{monthly.price}} /月</span></p>
                </div>
            </a>
        </div>
        <group style="margin-bottom: 10px;">
            <x-button v-if="monthly.isvip" type="primary" style="margin: 8px 20px; width: 90%;"
                      @click.native="handleOrder">立即订阅
            </x-button>
            <template v-else>
                <cell title="2016-12-30到期" style="font-size: 15px;">
                    <slot>
                        <x-button type="primary" plain mini @click.native="handleOrder">续订</x-button>
                    </slot>
                </cell>
                <x-switch title="到期自动续订" v-model="renew" style="font-size: 15px;"></x-switch>
            </template>
        </group>
        <c-list-view type="book" :list="dataList"></c-list-view>
        <c-dialog type="monthly" :show="show.dialog" :data="monthly" @confirm="handleConfirm"
                  @cancel="show.dialog=false"></c-dialog>
    </div>
</template>

<script>
    import {Group, Cell, XButton, XSwitch} from 'vux';
    import CListView from '../../components/ListView.vue';
    import CDialog from '../../components/Dialog.vue';

    export default {
        data () {
            return {
                monthly: {},
                dataList: [],
                renew: true,
                show: {
                    dialog: false
                }
            }
        },
        components: {
            Group, Cell, XButton, XSwitch, CListView, CDialog
        },
        methods: {
            getData(){
                app.ajax.get(app.config.api.monthly.monthly + this.$route.query.id, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.monthly = data;
                            this.dataList = data.booklist.map((book) => {
                                return {
                                    id: book.articleid,
                                    name: book.articlename,
                                    author: book.author,
                                    image: book.image,
                                    intro: book.intro,
                                    score: book.score
                                }
                            });
                            this.$store.commit('updateHeader', {
                                title: data.name,
                                showBack: true,
                                showSearch: true
                            });
                        }
                    }
                }, (err) => {
                });
            },
            handleOrder(e){
                this.show.dialog = true;
            },
            handleConfirm(renew){
                // 订阅 包月包
                console.log('续订：' + renew);
                this.renew = renew;

                this.show.dialog = false;
                this.$vux.toast.show({
                    text: '订阅成功!',
                    isShowMask: true
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
</style>

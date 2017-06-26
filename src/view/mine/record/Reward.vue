<template>
    <div class="mine-recharge">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <tab v-model="selected">
            <tab-item @on-item-click="handleClickTab">打赏</tab-item>
            <tab-item @on-item-click="handleClickTab">鲜花</tab-item>
            <tab-item @on-item-click="handleClickTab">月票</tab-item>
        </tab>
        <swiper v-model="selected" :show-dots="false">
            <swiper-item>
                <div v-if="data.reward instanceof Array" style="text-align: center;margin-top: 40px;">
                    <img src="../../../image/unMatch.png" width="80px">
                    <div>对不起，暂无新记录！</div>
                </div>
                <div v-else>
                    <div v-for="(con, key, index) in data.reward" :key="index">
                        <group :title="key+'月'">
                            <cell :title="detail.articlename" :inline-desc="detail.buytime"
                                  v-for="(detail, index) in con"
                                  :key="index">
                                <label style="font-family: PingFangSC-Medium;font-size: 18px;color: #EE4D22;">{{detail.price}}</label>
                                <label style="color: #EE4D22;">阅币</label>
                            </cell>
                        </group>
                    </div>
                </div>
            </swiper-item>
            <swiper-item>
                <div v-if="data.flower instanceof Array" style="text-align: center;margin-top: 40px;">
                    <img src="../../../image/unMatch.png" width="80px">
                    <div>对不起，暂无新记录！</div>
                </div>
                <div v-else>
                    <div v-for="(con, key, index) in data.flower" :key="index">
                        <group :title="key+'月'">
                            <cell :title="detail.articlename" :inline-desc="detail.buytime"
                                  v-for="(detail, index) in con"
                                  :key="index">
                                <label style="font-family: PingFangSC-Medium;font-size: 18px;color: #EE4D22;">{{detail.price}}</label>
                                <label style="color: #EE4D22;">朵</label>
                            </cell>
                        </group>
                    </div>
                </div>
            </swiper-item>
            <swiper-item>
                <div v-if="data.ticket instanceof Array" style="text-align: center;margin-top: 40px;">
                    <img src="../../../image/unMatch.png" width="80px">
                    <div>对不起，暂无新记录！</div>
                </div>
                <div v-else>
                    <div v-for="(con, key, index) in data.ticket" :key="index">
                        <group :title="key+'月'">
                            <cell :title="detail.articlename" :inline-desc="detail.buytime"
                                  v-for="(detail, index) in con"
                                  :key="index">
                                <label style="font-family: PingFangSC-Medium;font-size: 18px;color: #EE4D22;">{{detail.price}}</label>
                                <label style="color: #EE4D22;">张</label>
                            </cell>
                        </group>
                    </div>
                </div>
            </swiper-item>
        </swiper>
    </div>
</template>

<script>
    import {XHeader, Tab, TabItem, Swiper, SwiperItem, Group, Cell} from 'vux';

    export default {
        data () {
            return {
                selected: 0,
                data: {
                    reward: {},
                    flower: {},
                    ticket: {}
                }
            }
        },
        components: {
            XHeader, Tab, TabItem, Swiper, SwiperItem, Group, Cell
        },
        methods: {
            getRewardData(){
                app.ajax.get(app.config.api.mine.reward.reward + this.$store.state.user.uid, {},
                    (data) => {
                        this.data.reward = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            getFlowerData(){
                app.ajax.get(app.config.api.mine.reward.flower + this.$store.state.user.uid, {},
                    (data) => {
                        this.data.flower = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            getTicketData(){
                app.ajax.get(app.config.api.mine.reward.ticket + this.$store.state.user.uid, {},
                    (data) => {
                        this.data.ticket = data.result;
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            handleClickTab(index){
                if (index == 0) {
                    this.getRewardData();
                } else if (index == 1) {
                    this.getFlowerData();
                } else if (index == 2) {
                    this.getTicketData();
                }
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '打赏记录',
                showBack: true
            });
        },
        mounted(){
            this.getRewardData();
        }
    }
</script>
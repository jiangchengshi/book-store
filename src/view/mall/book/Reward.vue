<template>
    <div class="mall-book-reward">
        <group>
            <cell title="账户余额"><label style="color: #EE4D22;font-size: 16px;">{{info.money}}</label> 阅币
            </cell>
        </group>
        <group title="选择打赏金额">
            <div style="padding: 20px 0px;font-family: PingFangSC-Light;font-size: 16px;color: #57606A;">
                <checker v-model="reward.egold" default-item-class="checker-item"
                         selected-item-class="checker-item-selected">
                    <checker-item value="100">100阅币</checker-item>
                    <checker-item value="500">500阅币</checker-item>
                    <checker-item value="1000">1000阅币</checker-item>
                    <checker-item value="2000">2000阅币</checker-item>
                    <checker-item value="10000">10000阅币</checker-item>
                </checker>
            </div>
            <x-input title="其他金额" v-model="reward.egold" placeholder="输入具体金额打赏作者(单位：阅币)"
                     style="font-family: PingFangSC-Regular;font-size: 14px;color: #162636;"></x-input>
        </group>

        <x-button action-type="button" style="background: #35B4EB;border-radius: 5px;color: #FFFFFF;margin-top: 15px;"
                  @click.native="handleReward">
            确定打赏
        </x-button>

        <!-- 打赏 确认-->
        <c-dialog type="reward" :show="show.reward" :data="reward" @confirm="confirmReward"
                  @cancel="show.reward=false"></c-dialog>

        <!-- 阅币余额不足-->
        <c-dialog type="balance" :show="show.balance" :data="reward" @confirm="confirmBalance"
                  @cancel="show.balance=false"></c-dialog>
    </div>
</template>

<script>
    import {Group, Cell, XNumber, Checker, CheckerItem, XInput, XButton} from 'vux';
    import CDialog from '../../components/Dialog.vue';

    export default {
        data () {
            return {
                info: {
                    money: 0,
                    price: 50
                },
                reward: {
                    egold: 0,
                    name: this.$route.query.name,
                    action: '打赏'
                },
                show: {
                    reward: false,
                    balance: false
                }
            }
        },
        components: {
            Group, Cell, XNumber, Checker, CheckerItem, XInput, XButton, CDialog
        },
        methods: {
            getData(){
                app.ajax.get(app.config.api.book.reward.get + this.$store.state.user.uid, {},
                    (data) => {
                        Object.assign(this.info, data.result);
                    }, (err) => {
                        this.$vux.toast.show({
                            text: '系统异常，请稍后重试...',
                            type: 'warn'
                        });
                        app.log.error(err);
                    });
            },
            handleReward(){
                if (this.reward.egold <= 0) {
                    this.$vux.toast.show({
                        text: '请选择打赏阅读币',
                        type: 'warn'
                    });
                    return;
                }

                this.show.reward = true;
            },
            confirmReward(){
                app.ajax.post(app.config.api.book.reward.add, {
                    uid: this.$store.state.user.uid,
                    price: this.reward.egold,
                    articleid: this.$route.query.id
                }, (data) => {
                    this.show.reward = false;

                    if (data.result.result == 1) { // 1:成功
                        this.$vux.toast.show({
                            text: '打赏成功'
                        });
                        this.getData();
                    } else if (data.result.result == 2) {   // 2:余额不足
                        this.show.balance = true;
                        this.show.reward = false;
                    } else if (data.result.result == 3) {   // 3:书籍不存在
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
            confirmBalance(){
                this.$router.push({path: '/recharge'});
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '打赏',
                showBack: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>
<style>
    .mall-book-ticket .weui-cells {
        margin-top: 10px;
    }

    .mall-book-ticket .weui-cells .weui-cell:before {
        border: initial;
    }

    .mall-book-ticket .weui-cell__ft.vux-cell-primary > div {
        float: initial;
    }

    .mall-book-reward .checker-item {
        background: #FFFFFF;
        border: 1px solid #57606A;
        border-radius: 8px;
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin-left: 15px;
        margin-bottom: 10px;
    }

    .mall-book-reward .checker-item-selected {
        background: #35B4EB;
        border-radius: 8px;
    }
</style>
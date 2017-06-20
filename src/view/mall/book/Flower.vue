<template>
    <div class="mall-book-flower">
        <group>
            <cell title="账户余额"><label style="color: #EE4D22;font-size: 16px;">{{info.money}}</label> 阅币
            </cell>
        </group>
        <group title="送鲜花">
            <div style="text-align: center;padding: 15px 0px;">
                <img src="../../../image/flower.png" width="80px">
            </div>
            <div style="text-align: center;font-family: PingFangSC-Regular;font-size: 14px;color: #57606A;">
                每朵 <label style="color: #EE4D22;">{{info.price}}</label> 阅币
            </div>
            <div style="width: 72%;">
                <x-number v-model="flower.num"></x-number>
            </div>
            <cell title="合计">
                <label style="color: #EE4D22;font-size: 18px;">{{egold}} 阅币</label>
            </cell>
        </group>
        <x-button action-type="button" style="background: #35B4EB;border-radius: 5px;color: #FFFFFF;margin-top: 15px;"
                  @click.native="handleFlower">
            确定赠送
        </x-button>

        <!-- 送鲜花 确认-->
        <c-dialog type="ticketConfirm" :show="show.confirm" :data="flower" @confirm="confirmFlower"
                  @cancel="show.confirm=false"></c-dialog>
        <!-- 阅币余额不足-->
        <c-dialog type="balanceLess" :show="show.less" :data="flower" @cancel="show.less=false"></c-dialog>
    </div>
</template>

<script>
    import {Group, Cell, XNumber, XButton} from 'vux';
    import CDialog from '../../components/Dialog.vue';

    export default {
        data () {
            return {
                info: {
                    money: 0,
                    price: 50
                },
                flower: {
                    num: 0,
                    egold: 0,
                    name: this.$route.query.name,
                    action: '送鲜花'
                },
                show: {
                    confirm: false,
                    less: false
                }
            }
        },
        components: {
            Group, Cell, XNumber, XButton, CDialog
        },
        computed: {
            egold() {
                return Number(this.flower.num) * Number(this.info.price);
            }
        },
        methods: {
            getData(){
                app.ajax.get(app.config.api.book.flower.get + this.$store.state.user.uid, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            Object.assign(this.info, data);
                        }
                    }
                }, (err) => {
                });
            },
            handleFlower(){
                if (this.flower.num <= 0) {
                    this.$vux.toast.show({
                        text: '请选择鲜花数量',
                        type: 'warn'
                    });
                    return;
                }

                this.flower.egold = this.egold;
                this.show.confirm = true;
            },
            confirmFlower(){
                app.ajax.post(app.config.api.book.flower.add, {
                    uid: this.$store.state.user.uid,
                    num: this.flower.num,
                    articleid: this.$route.query.id
                }, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            if (data.result == 1) { // 1:成功
                                this.$vux.toast.show({
                                    text: '赠送月票成功'
                                });
                            } else if (data.result == 2) {   // 2:余额不足
                                this.show.less = true;
                                this.show.confirm = false;
                            } else if (data.result == 3) {   // 3:书籍不存在
                                this.$vux.toast.show({
                                    text: '书籍不存在',
                                    type: 'warn'
                                });
                            }
                        }
                    }
                }, (err) => {
                });
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '送鲜花',
                showBack: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>
<style>
    .mall-book-flower .weui-cells {
        margin-top: 10px;
    }

    .mall-book-flower .weui-cells .weui-cell:before {
        border: initial;
    }

    .mall-book-flower .weui-cell__ft.vux-cell-primary > div {
        float: initial;
    }
</style>
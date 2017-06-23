<template>
    <div class="mine-news">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <div v-if="dataList && dataList.length>0">
            <scroller :on-infinite="handleInfinite" style="top: 46px;background: #FFFFFF;" :height="height+''">
                <timeline>
                    <timeline-item v-for="(data, index) in dataList" :key="index">
                        <div style="font-size: 12px;color: #162636;margin-bottom: 5px;">{{data.addtime}}</div>
                        <div style="background: #F0F4F6;height: 50px;padding: 10px 10px 0px">
                            <div style="float: left;width: 40px; height: 40px;line-height: 40px;text-align: center;
                                font-size: 12px;color: #FFFFFF;background: #FD5D6C;border-radius: 4px;">
                                通知
                            </div>
                            <div style="margin-left: 50px;">
                                <span style="display: block;font-size: 16px;color: #162636;">{{data.title}}</span>
                                <span style="display: block;opacity: 0.56;font-size: 12px;color: #162636;text-overflow:ellipsis;overflow: hidden;white-space:nowrap;">
                                    {{data.summary}}
                                </span>
                            </div>
                        </div>
                    </timeline-item>
                </timeline>
            </scroller>
        </div>
        <div v-else style="text-align: center;margin-top: 40px;">
            <img src="../../image/unMatch.png" width="80px">
            <div>对不起，暂无新记录！</div>
        </div>
    </div>
</template>

<script>
    import {XHeader, Timeline, TimelineItem} from 'vux';

    export default {
        data () {
            return {
                height: app.config.setting.height.display - app.config.setting.height.header,
                page: 1,
                dataList: []
            }
        },
        components: {
            XHeader, Timeline, TimelineItem
        },
        methods: {
            getData(callback){
                app.ajax.get(app.config.api.mine.news + this.$store.state.user.uid + "/" + this.page, {},
                    (data) => {
                        if (data.result && data.result.length > 0) {
                            this.dataList = this.dataList.concat(data.result);

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
                title: '我的消息',
                showBack: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>
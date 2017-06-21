<template>
    <div class="mine-review">
        <x-header :title="$store.state.header.title"
                  :left-options="{showBack: $store.state.header.showBack, backText: $store.state.header.backText}">
        </x-header>
        <div v-if="dataList && dataList.length>0">
            <c-list-view type="review" :list="dataList"></c-list-view>
        </div>
        <div v-else style="text-align: center;margin-top: 40px;">
            <img src="../../image/unMatch.png" width="80px">
            <div>对不起，暂无新记录！</div>
        </div>
    </div>
</template>

<script>
    import {XHeader} from 'vux';
    import CListView from '../components/ListView.vue';

    export default {
        data () {
            return {
                dataList: []
            }
        },
        components: {
            XHeader, CListView
        },
        methods: {
            getData(){
                app.ajax.get(app.config.api.mine.review + this.$store.state.user.uid, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.dataList = data;
                        }
                    }
                }, (err) => {
                });
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '我的评论',
                showBack: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>
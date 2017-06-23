<template>
    <div class="mall-topic-detail">
        <card>
            <img slot="header" :src="topic.image" :style="{width: width+'px'}">
            <div slot="content" style="padding: 10px;">
                <p style="font-size: 16px;line-height: 25px;color: #232121;">{{topic.title}}</p>
                <p style="font-size: 13px;line-height:20px;color:#828181;">{{topic.intro}}</p>
            </div>
        </card>
        <c-list-view type="book" :list="dataList"></c-list-view>
    </div>
</template>

<script>
    import {Card} from  'vux';
    import CListView from '../../components/ListView.vue';

    export default {
        data () {
            return {
                width: app.config.setting.width.display,
                topic: {},
                dataList: []
            }
        },
        components: {
            Card, CListView
        },
        methods: {
            getData(){
                app.ajax.get(app.config.api.topic + this.$route.query.id, {},
                    (data) => {
                        this.topic = data.result;
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
                        this.$store.commit('updateHeader', {
                            title: data.result.title,
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
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '加载中',
                showBack: true,
                showSearch: true
            });
        },
        mounted(){
            this.getData();
        }
    }
</script>

<style scoped>
    .mall-topic-detail .list-view {
        margin-top: 10px;
    }
</style>
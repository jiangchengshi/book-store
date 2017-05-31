<template>
    <div class="mall-book-special">
        <c-list-view type="book" :list="dataList"></c-list-view>
    </div>
</template>

<script>
    import CListView from '../../components/ListView.vue';

    export default {
        data () {
            return {
                dataList: []
            }
        },
        components: {
            CListView
        }, created(){
            this.$store.commit('updateHeader', {
                title: '特价',
                showBack: true,
                showSearch: true
            });
        },
        mounted(){
            app.ajax.get(app.config.api.book.special, {}, (resp) => {
                if (resp.status == 200) {
                    let data = resp.data.result;
                    if (data) {
                        this.dataList = data.map((item, index) => ({
                            src: item.image,
                            title: item.name,
                            score: item.score,
                            desc: item.intro,
                            author: item.author,
                            url: item.url
                        }));
                    }
                }
            }, (err) => {
            });
        }
    }
</script>
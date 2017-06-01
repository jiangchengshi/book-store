<template>
    <div class="mall-book-new">
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
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '新书',
                showBack: true,
                showSearch: true
            });
        },
        mounted(){
            app.ajax.get(app.config.api.book.new, {}, (resp) => {
                if (resp.status == 200) {
                    let data = resp.data.result;
                    if (data) {
                        this.dataList = data;
                    }
                }
            }, (err) => {
            });
        }
    }
</script>
<template>
    <div class="mall-monthly-list">
        <c-list-view type="monthly" :list="dataList"></c-list-view>
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
                title: '包月',
                showBack: true,
                showSearch: true
            });
        },
        mounted(){
            app.ajax.get(app.config.api.monthly.monthly, {}, (resp) => {
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
<template>
    <div class="catalog">
        <group>
            <cell v-for="(catalog, index) in dataList" :key="index">
                <span slot="title" v-if="catalog.isvip==0">{{catalog.chaptername}}</span>
                <template v-else>
                    <span slot="title" style="color: #989A9C;">{{catalog.chaptername}}</span>
                    <i class="iconfont icon-lock"></i>
                </template>
            </cell>
        </group>
    </div>
</template>

<script>
    import {Group, Cell} from 'vux';

    export default {
        data () {
            return {
                dataList: []
            }
        },
        components: {
            Group, Cell
        },
        methods: {
            getData(page){
                app.ajax.get(app.config.api.reader.chapters + this.$route.query.id + '/' + page, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data.result;
                        if (data) {
                            this.dataList = data.result;
                        }
                    }
                }, (err) => {
                });
            }
        },
        created(){
            this.$store.commit('updateHeader', {
                title: '目录',
                showBack: true
            });
        },
        mounted(){
            this.getData(1);
        }
    }
</script>

<style scoped>
    .main {
        margin: 0;
        padding: 0;
    }
</style>
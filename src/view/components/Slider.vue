<template>
    <slider :width="width+'px'" :height="height+'px'" :interval="3000" :speed="1000" :auto="true"
            indicators="center" :control-btn="false" animation="fade">
        <slider-item v-for="data in dataList" :key="data.id">
            <img :src="data.image" :data-id="data.id">
        </slider-item>
    </slider>
</template>

<script>
    import {Slider, SliderItem} from "vue-easy-slider";

    export default {
        data () {
            return {
                width: this.slider.width,
                height: this.slider.height,
                url: this.slider.url,
                dataList: []
            }
        },
        components: {
            Slider, SliderItem
        },
        props: ['slider'],
        methods: {
            getData(){
                app.ajax.get(this.url, {}, (resp) => {
                    if (resp.status == 200) {
                        let data = resp.data;
                        if (data.result) {
                            this.dataList = data.result;
                        }
                    }
                }, (err) => {

                });
            }
        },
        mounted(){
            this.getData();
        }
    }
</script>

<style scoped>
    img {
        width: 375px;
        height: 250px;
    }
</style>
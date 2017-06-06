<template>
    <swiper :list="list" :auto="auto" :loop="loop"></swiper>
</template>

<script>
    import {Swiper, SwiperItem} from 'vux';
    export default {
        data () {
            return {}
        },
        components: {
            Swiper
        },
        props: [
            'auto', 'loop', 'list'
        ]
    }
</script>

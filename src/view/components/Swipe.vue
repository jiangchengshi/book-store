<template>
  <swiper :height="height+'px'" :list="dataList" :auto="auto" :loop="loop"></swiper>
</template>

<script>
  import {Swiper, SwiperItem} from 'vux';
  export default {
    data () {
      return {
        dataList: [],
        url: this.swipe.url,
        height: this.swipe.height,
        auto: this.swipe.auto,
        loop: this.swipe.loop
      }
    },
    components: {
      Swiper
    },
    props: [
      'swipe'
    ],
    methods: {
      getData(){
        app.ajax.get(this.url, {}, (resp) => {
          if (resp.status == 200) {
            let data = resp.data;
            if (data.result) {
              this.dataList = data.result.map((item, index) => ({
                title: item.name,
                img: item.image,
                url: ''
              }));
            }
          }
        }, (err) => {
          console.log(err);
        });
      }
    },
    created(){
      if (!this.height) {
        this.height = 180;
      }
    },
    mounted(){
      this.getData();
    }
  }
</script>

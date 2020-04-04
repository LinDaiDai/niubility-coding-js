<template>
  <div id="app">
    <my-header></my-header>
    <div class="content" style="color: yellow;">
      {{ msg }}
    </div>
    <div class="color_blue">我是测试sass的222</div>
    <img src="./assets/LinDaiDai.png" />
  </div>
</template>
<script>
import img from './assets/LinDaiDai.png'
import MyHeader from './components/my-header.vue'
export default {
  name: 'app',
  components: {
    MyHeader
  },
  data() {
    return {
      msg: 'Hello LinDaiDai'
    }
  },
  mounted() {
    console.log(img)
  }
}
</script>
<style lang="scss">
body {
  margin: 0;
}
.content {
  text-align: center;
}
</style>

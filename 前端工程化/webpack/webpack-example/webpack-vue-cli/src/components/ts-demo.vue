<template>
  <div class="header">
    <h2>
      {{ msg }}
    </h2>
  </div>
</template>
<script lang="ts">
export default {
  data(): Object {
    return {
      msg: '我是测试ts'
    }
  }
}
</script>
<style scoped>
.header {
  color: #ff2222;
}
</style>

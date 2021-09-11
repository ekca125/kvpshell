<template>
<div>
  <table>
    <thead>
      <td colspan="2">플러그인</td>
    </thead>
    <thead>
      <td>이름</td>
      <td>설명</td>
    </thead>
    <tr>
      <td>플러그인</td>
      <td>플러그인 설명</td>
    </tr>
    <tr>
      <td>플러그인</td>
      <td>플러그인 설명</td>
    </tr>
  </table>
</div>
</template>

<script>
export default {
  name: 'PluginTableComponent',
  props: {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table{
  border-collapse: collapse;
  width: 100%;
  height: 100%;
}

td{
  border:black solid 1px
}
</style>
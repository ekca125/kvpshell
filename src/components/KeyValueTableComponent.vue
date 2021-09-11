<template>
  <table>
    <thead>
      <td colspan="2">Key - Value</td>
    </thead>
    <thead>
      <td>Key</td>
      <td>value</td>
    </thead>
    <tr>
      <td>키</td>
      <td>값</td>
    </tr>
    <tr>
      <td>키</td>
      <td>값</td>
    </tr>
  </table>

<div>
  <input/>
  <button>실행</button>
</div>

</template>

<script>
export default {
  name: 'KeyValueTableComponent',
  props: {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table{
  border-collapse: collapse;
  width:100%;
  height:100%;
}
td{
  border:black solid 1px
}

input{
  display: inline-block;
  height:100%;
  width: 100%;
}
  button{
    display: block;
    height : 100%;
    width:100%;
  }
div{
  width: 100%;
  height: 100%;
}
</style>
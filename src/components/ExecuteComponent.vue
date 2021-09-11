<template>
<div>
  <input/>
  <button>실행</button>
</div>
</template>

<script>
export default {
  name: 'ExecuteComponent',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p{
  display: inline-block;
  width:20%;
}
input{
  display: inline-block;
  width: 100%;
}
  button{
    display: block;
    width:100%;
  }
div{
  width: 100%;
  height: 100%;
}
</style>
<template>
  <q-page class="flex flex-center">
    <div id="maindiv1">
      <div id="left-div">
        <KeyValueTableComponent/>
      </div>
      <div class="right-div">
        <PluginTableComponent/>
      </div>
    </div>
    <div class="maindiv2">
       <ExecuteComponent/> 
    </div>  
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import KeyValueTableComponent from "../components/KeyValueTableComponent.vue";
import PluginTableComponent from "../components/PluginTableComponent.vue"
import ExecuteComponent from "../components/ExecuteComponent.vue"

export default defineComponent({
  name: 'MainPage',
  components : {
    KeyValueTableComponent,
    PluginTableComponent,
    ExecuteComponent
  }
})
</script>

<style scoped>
div#left-div{
  display: inline-block;
  width: 50%;
  height: 100%;
}

div#right-div{
  display: inline-block;
  width: 50%;
  height: 100%;
}

div#maindiv1{
  display: block;
}

div#maindiv2{
  display: block;
}

div#right-down-div{

}
</style>

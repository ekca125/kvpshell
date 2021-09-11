<template>
  <q-page class="flex flex-center">
    <div>
      <div class="left">
        <PluginTableComponent />
        
      </div>
      <div class="right">
        <KeyValueTableComponent />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import KeyValueTableComponent from "../components/KeyValueTableComponent.vue";
import PluginTableComponent from "../components/PluginTableComponent.vue";

export default defineComponent({
  name: "MainPage",
  components: {
    KeyValueTableComponent,
    PluginTableComponent
  },
});
</script>

<style scoped>
div {
  width: 100%;
  height: 500px;
  border: 1px solid #003458;
}
div.left {
  width: 30%;
  float: left;
  box-sizing: border-box;
}
div.right {
  width: 70%;
  float: right;
  box-sizing: border-box;
}
PluginTableComponent{
  width: 100%;
  height : 100%;
}

KeyValueTableComponent{
  width: 100%;
  height : 60%;
}

ExecuteComponent{
  width: 100%;
  height: 40%;
}

</style>

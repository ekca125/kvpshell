<template>
  <q-page class="flex flex-center">
    <p>Hello World Main Page</p>
    <!--컴포넌트들을 불러와서 설정 -->
    
    <KeyValueTableComponent/>
    <PluginTableComponent/>
    <ExecuteComponent/>
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

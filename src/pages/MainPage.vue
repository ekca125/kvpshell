<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-table
        title="Plugin"
        :rows="plugin_datas"
        :columns="plugin_table_columns"
        row-key="name"
      >
      
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

const stub_plugin_datas = [
  {
    index: 0,
    plugin_name: "plugin_preset",
    plugin_exec: "plugin_exe",
    plugin_key_value: [
      {
        key: "default key1",
        value: "default key value1",
      },
      {
        key: "default key2",
        value: "default key value2",
      },
    ],
  },
  {
    index: 1,
    plugin_name: "plugin_preset",
    plugin_exec: "plugin_exe",
    plugin_key_value: [
      {
        key: "default key4",
        value: "default key value1",
      },
      {
        key: "default key5",
        value: "default key value2",
      },
    ],
  },
];

const stub_plugin_pos = 0;

const plugin_table_columns = [
  { name: "plugin_name", label: "plugin_name", field: "plugin_name"},
];

export default defineComponent({
  name: "MainPage",
  setup() {
    return {
      plugin_datas:stub_plugin_datas,
      plugin_pos:stub_plugin_pos,
      plugin_table_columns
    };
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
</style>

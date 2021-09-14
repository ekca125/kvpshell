<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <div class="plugins">
        <q-table
          title="Plugin"
          :rows="plugin_datas"
          :columns="plugin_table_columns"
          :filter="filter"
          row-key="plugin_name"
          @row-click="onRowClickPluginTable"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
        </q-table>
      </div>
      <div class="plugin_data">

      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
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
  {
    name: "plugin_name",
    align: "left",
    label: "plugin_name",
    field: "plugin_name",
  },
];

export default defineComponent({
  name: "MainPage",
  setup() {
    return {
      filter: ref(""),
      plugin_datas: stub_plugin_datas,
      plugin_pos: stub_plugin_pos,
      plugin_table_columns,
    };
  },
  methods:{
    onRowClickPluginTable:function(evt,row,index){
      console.log("test")
    }
  }
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

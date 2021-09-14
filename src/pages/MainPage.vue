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
        <q-table
          title="Treats"
          :rows="current_plugin_key_value"
          :columns="plugin_data_table_columns"
          row-key="name"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { defineComponent } from "vue";

const plugin_datas = [
  {
    index: 0,
    plugin_name: "plugin_preset",
    plugin_exec: "plugin_exe",
    plugin_key_value: [
      {
        plugin_key: "default key1",
        plugin_value: "default key value1",
      },
      {
        plugin_key: "default key2",
        plugin_value: "default key value2",
      },
    ],
  },
  {
    index: 1,
    plugin_name: "plugin_preset",
    plugin_exec: "plugin_exe",
    plugin_key_value: [
      {
        plugin_key: "default key4",
        plugin_value: "default key value1",
      },
      {
        plugin_key: "default key5",
        plugin_value: "default key value2",
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

const plugin_data_table_columns = [
  {
    name: "plugin_key",
    align: "left",
    label: "plugin_key",
    field: "plugin_key",
  },
  {
    name: "plugin_value",
    align: "left",
    label: "plugin_value",
    field: "plugin_value",
  }
];

export default defineComponent({
  name: "MainPage",
  setup() {
    return {
      filter: ref(""),
      plugin_datas: plugin_datas,
      plugin_pos: stub_plugin_pos,
      plugin_table_columns,
      plugin_data_table_columns
    };
  },
  computed:{
    current_plugin_key_value:function(){
      return plugin_datas[plugin_pos].plugin_key_value
    }
  },
  methods: {
    onRowClickPluginTable: function (evt, row, index) {
      //console.log(index);
      this.plugin_pos=index
    },
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

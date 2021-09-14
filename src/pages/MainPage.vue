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
          :rows="plugin_datas[current_plugin_pos].plugin_key_value"
          :columns="plugin_data_table_columns"
          row-key="name"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="plugin_key" :props="props">
                {{ props.row.plugin_key }}
              </q-td>
              <q-td key="plugin_value" :props="props">
                {{ props.row.plugin_value }}
                <q-popup-edit
                  v-model="props.row.plugin_value"
                  title="Update plugin value"
                  buttons
                >
                  <q-input
                    type="text"
                    v-model="props.row.plugin_value"
                    dense
                    autofocus
                  />
                </q-popup-edit>
              </q-td>
              
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { defineComponent } from "vue";

const stub_plugin_datas = [
  {
    //플러그인을 가져올때 생성
    //CLI 실행 명령의 대체 GUI
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

const stub_plugin_pos = 1;

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
  },
];

export default defineComponent({
  name: "MainPage",
  setup() {
    return {
      //plugin ui
      filter: ref(""),
      plugin_table_columns,
      //plugin key value ui
      plugin_data_table_columns,
      //datas
      plugin_datas: ref(stub_plugin_datas),
      current_plugin_pos: ref(stub_plugin_pos),
    };
  },
  methods: {
    onRowClickPluginTable: function (evt, row, index) {
      //console.log(index);
      this.current_plugin_pos = index;
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

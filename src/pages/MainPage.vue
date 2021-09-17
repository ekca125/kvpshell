<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <div class="left-screen">
        <div id="plugin-container">
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
      </div>
      <div class="right-screen">
        <div id="plugin-info-container">
          <q-table
            title="Plugin Key Value"
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
        <div class="plugin-execute-container">
          <div id="plugin-execute-input">
            <q-field label="Standard" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ execute_text() }}
                </div>
              </template>
            </q-field>
            <div id="plugin-execute-btn">
              <q-btn
                color="white"
                text-color="black"
                label="Copy"
                @click="copyCommand"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { defineComponent } from "vue";
import { copyToClipboard } from "quasar";

const stub_plugin_datas = [
  {
    index: 0,
    plugin_name: "plugin_preset",
    plugin_exec: "plugin1_exe --a $KEY1$ --b $KEY2$",
    plugin_key_value: [
      {
        plugin_key: "KEY1",
        plugin_value: "defaultkey",
      },
      {
        plugin_key: "KEY2",
        plugin_value: "defaultkey2",
      },
    ],
  },
  {
    index: 1,
    plugin_name: "plugin_preset",
    plugin_exec: "plugin2_exe $key3$ $key4$",
    plugin_key_value: [
      {
        plugin_key: "key3",
        plugin_value: "defaultkey3",
      },
      {
        plugin_key: "key4",
        plugin_value: "defaultkey4",
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
  },
];

import { useQuasar } from "quasar";

export default defineComponent({
  name: "MainPage",
  setup() {
    const $q = useQuasar();
    return {
      // table columns 정의
      plugin_table_columns,
      plugin_data_table_columns,
      // plugin name filter
      filter: ref(""),
      // datas
      plugin_datas: ref(stub_plugin_datas),
      current_plugin_pos: ref(stub_plugin_pos),
    };
  },
  computed: {},
  methods: {
    onRowClickPluginTable: function (evt, row, index) {
      this.current_plugin_pos = index;
    },
    execute_text() {
      try {
        let plugin_exec =
          this.plugin_datas[this.current_plugin_pos].plugin_exec;
        let plugin_key_value =
          this.plugin_datas[this.current_plugin_pos].plugin_key_value;
        for (let i = 0; i < plugin_key_value.length; i++) {
          let plugin_key = plugin_key_value[i].plugin_key;
          let plugin_value = plugin_key_value[i].plugin_value;

          plugin_key = "$" + plugin_key + "$";
          plugin_exec = plugin_exec.replace(plugin_key, plugin_value);
        }
        return plugin_exec;
      } catch (e) {
        return "none";
      }
    },
    copyCommand: function (evt, navigateFn) {
      copyToClipboard(this.execute_text())
        .then(() => {
          this.$q.notify("Success");
        })
        .catch(() => {
          this.$q.notify("Fail");
        });
    },
  },
});
</script>

<style scoped>
div.q-pa-md {
  width: 100%;
  height: 100%;
}

div.left-screen {
  width: 30%;
  float: left;
  box-sizing: border-box;
}
div.right-screen {
  width: 70%;
  float: right;
  box-sizing: border-box;
}

div#plugin-execute-container {
  display: inline-block;
  width: 70%;
}
</style>

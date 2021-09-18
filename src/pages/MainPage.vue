<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <div class="left-screen">
        <q-table
          title="Plugin"
          :rows="pluginDatas"
          :columns="pluginDataTableColumns"
          :filter="filter"
          row-key="pluginName"
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
      <div class="right-screen">
        <q-table
          title="Plugin Key Value"
          :rows="pluginDatas[currentPluginPos].pluginKeyValue"
          :columns="pluginKeyValueTableColums"
          row-key="name"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="pluginKey" :props="props">
                {{ props.row.pluginKey }}
              </q-td>
              <q-td key="pluginValue" :props="props">
                {{ props.row.pluginValue }}
                <q-popup-edit
                  v-model="props.row.pluginValue"
                  title="Update plugin value"
                  buttons
                >
                  <q-input
                    type="text"
                    v-model="props.row.pluginValue"
                    dense
                    autofocus
                  />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <div class="kv-function">
          <div
            class="kv-exec"
            v-if="pluginDatas[currentPluginPos].pluginMode == 'exec'"
          >
            <q-field id="kv-exec-field" label="CLI Command" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ getExecuteCommand() }}
                </div>
              </template>
            </q-field>
            <q-btn
              id="kv-exec-btn"
              color="white"
              text-color="black"
              label="Copy"
              @click="onCopyCommand"
            />
          </div>
          <div
            class="kv-js"
            v-if="pluginDatas[currentPluginPos].pluginMode == 'js'"
          >
            <q-btn label="Execute" color="primary" @click="prompt"></q-btn>
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
import { useQuasar } from "quasar";

export default defineComponent({
  name: "MainPage",
  setup() {
    // quasar function
    const $q = useQuasar();

    // ui 정의
    const pluginDataTableColumns = [
      {
        name: "pluginName",
        align: "left",
        label: "pluginName",
        field: "pluginName",
      },
      {
        name: "pluginMode",
        align: "left",
        label: "pluginMode",
        field: "pluginMode",
      },
      {
        name: "pluginDesc",
        align: "left",
        label: "pluginDesc",
        field: "pluginDesc",
      },
    ];

    const pluginKeyValueTableColums = [
      {
        name: "pluginKey",
        align: "left",
        label: "pluginKey",
        field: "pluginKey",
      },
      {
        name: "pluginValue",
        align: "left",
        label: "pluginValue",
        field: "pluginValue",
      },
    ];

    // 반환
    return {
      // table columns
      pluginDataTableColumns,
      pluginKeyValueTableColums,
      // data
      filter: ref(""),
      pluginDatas: ref(window.apiPluginData.getPluginData("", {})),
      currentPluginPos: ref(0),
      confirm: ref(false)
    };
  },
  computed: {},
  methods: {
    // events
    onRowClickPluginTable: function (evt, row, index) {
      this.currentPluginPos = index;
    },
    onCopyCommand: function(evt, navigateFn) {
      copyToClipboard(this.getExecuteCommand())
        .then(() => {
          this.$q.notify("Success");
        })
        .catch(() => {
          this.$q.notify("Fail");
        });
    },

    getExecuteCommand() {
      try {
        let pluginExec = this.pluginDatas[this.currentPluginPos].pluginExec;
        let pluginKeyValue =
          this.pluginDatas[this.currentPluginPos].pluginKeyValue;

        for (let i = 0; i < pluginKeyValue.length; i++) {
          let pluginKey = pluginKeyValue[i].pluginKey;
          let pluginValue = pluginKeyValue[i].pluginValue;

          pluginKey = "$" + pluginKey + "$";
          pluginExec = pluginExec.replace(pluginKey, pluginValue);
        }
        return pluginExec;
      } catch (e) {
        console.log(e);
        return "none";
      }
    },
    
    prompt: function () {
      this.$q.dialog({
        title: 'Check',
        message: 'Confirm Execution',
        prompt: {
          model: this.getExecuteCommand(),
          type: 'textarea' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
         console.log('>>>> OK, received', data)
         window.apiEval.runEval("",{"script":this.getExecuteCommand()})
      }).onCancel(() => {
         console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
  },
});
</script>

<style scoped>
div.q-pa-md {
  width: 100%;
  height: 100%;
}

div.left-screen {
  width: 40%;
  float: left;
  box-sizing: border-box;
}
div.right-screen {
  width: 55%;
  float: right;
  box-sizing: border-box;
}
</style>

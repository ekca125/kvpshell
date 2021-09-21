<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <div id="left-screen">
        <q-table
          title="Plugin"
          :rows="pluginDatas"
          :columns="pluginDataTableColumns"
          :filter="pluginNameFilter"
          row-key="pluginName"
          @row-click="onRowClickPluginTable"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="pluginNameFilter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
        </q-table>
      </div>
      <div id="right-screen">
        <q-table
          title="Plugin Key Value"
          :rows="pluginDatas[currentPluginPos].pluginKeyValue"
          :columns="pluginKeyValueTableColumns"
          row-key="name"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="pluginKey" :props="props">
                {{ props.row.pluginKey }}
              </q-td>
              <q-td key="pluginKeyDesc" :props="props">
                {{ props.row.pluginKeyDesc }}
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
              id="kv-cli-copy-btn"
              color="white"
              text-color="black"
              label="Copy"
              @click="onCliCopy"
            />
            <q-btn
              id="kv-cli-run-btn"
              color="white"
              text-color="black"
              label="Run"
              @click="onCliRun"
            />
          </div>
          <div
            class="kv-script"
            v-if="pluginDatas[currentPluginPos].pluginMode != 'exec'"
          >
            <q-btn
              label="Execute"
              color="primary"
              @click="showConfirmDialog"
            ></q-btn>
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
import { computed, reactive } from "vue";

export default defineComponent({
  name: "MainPage",
  setup() {
    // Quasar Function
    const quasarFunction = useQuasar();

    // Table Columns
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

    const pluginKeyValueTableColumns = [
      {
        name: "pluginKey",
        align: "left",
        label: "pluginKey",
        field: "pluginKey",
      },
      {
        name: "pluginKeyDesc",
        align: "left",
        label: "pluginKeyDesc",
        field: "pluginKeyDesc",
      },
      {
        name: "pluginValue",
        align: "left",
        label: "pluginValue",
        field: "pluginValue",
      },
    ];

    // 데이터
    let pluginDatas = reactive(window.apiPluginData.getPluginData("", {}));
    let pluginNameFilter = ref("");
    let currentPluginPos = ref(0);
    let confirm = ref(false);

    // 반환
    return {
      //
      quasarFunction,
      // data
      pluginDataTableColumns,
      pluginKeyValueTableColumns,
      pluginNameFilter,
      pluginDatas,
      currentPluginPos,
      confirm,
    };
  },
  computed: {},
  methods: {
    // events
    onCliCopy: function (evt, navigateFn) {
      copyToClipboard(this.getExecuteCommand())
        .then(() => {
          this.quasarFunction.notify("Success");
        })
        .catch(() => {
          this.quasarFunction.notify("Fail");
        });
    },

    onRowClickPluginTable: function (evt, row, index) {
      this.currentPluginPos = index;
    },

    onCliRun: function (evt, navigateFn) {
      this.runCli(this.getExecuteCommand())
    },
    // ui
    showResultDialog: function (selectMessage) {
      this.quasarFunction
        .dialog({
          title: "Result",
          message: selectMessage,
        })
        .onOk(() => {
          // console.log('OK')
        })
        .onCancel(() => {
          // console.log('Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },

    showConfirmDialog: function () {
      this.quasarFunction
        .dialog({
          title: "Check",
          message: "Confirm Execution",
          prompt: {
            model: this.getExecuteCommand(),
            type: "textarea", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.runScript(this.getExecuteCommand());
        })
        .onCancel(() => {
          this.quasarFunction.notify("cancel");
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },

    // function
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

    runCli(cliCommand){
      let result = window.apiChildProcess.runChildProcess("", {script: cliCommand});
      this.showResultDialog(result);
    },

    runScript(script) {
      let result = "";
      if (this.pluginDatas[this.currentPluginPos].pluginMode == "js") {
        result = window.apiEval.runEval("", { script });
      }
      else if(this.pluginDatas[this.currentPluginPos].pluginMode == "external_exec"){
        //runchildProcessBatch
        result = window.apiChildProcess.runChildProcessBatch("", {script,});
      }
      this.showResultDialog(result);
    },
  },
});
</script>

<style scoped>
div.q-pa-md {
  width: 100%;
  height: 100%;
}

div#left-screen {
  width: 40%;
  float: left;
  box-sizing: border-box;
}
div#right-screen {
  width: 55%;
  float: right;
  box-sizing: border-box;
}

div.kv-function{
  margin-top: 10px;
}

</style>

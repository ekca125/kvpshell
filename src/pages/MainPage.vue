<template>
  <q-page class="padding">
    <div class="q-pa-md">
      <div class="row">
        <div class="col">
          <!-- 플러그인 테이블 시작 -->
          <q-table
            id="plugin"
            title="Plugins"
            :rows="pluginDatas"
            :columns="pluginDataTableColumns"
            :filter="pluginNameFilter"
            row-key="pluginName"
            @row-click="onRowClickPluginTable"
          >
            <template v-slot:top-right>
              <div class="row">
                <div class="col">
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
                </div>
              </div>
             
            </template>
          </q-table>
          <!-- 플러그인 테이블 끝 -->
        </div>
        <div class="col">
          <!-- 키 값 테이블 시작 -->
          <q-table
            id="pkv"
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
                  <q-input
                    type="text"
                    v-model="props.row.pluginValue"
                    dense
                    autofocus
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <!-- 키 값 테이블 끝 -->
        </div>
        <div class="col">
          <!-- 소스 텍스트 시작-->
          <q-btn
            class="result"
            color="primary"
            @click="copyClipResult"
            label="Copy"
          ></q-btn>
          <q-btn
            class="result"
            color="primary"
            @click="saveResultFile"
            label="Save"
          ></q-btn>
          <q-btn
            class="result"
            color="primary"
            @click="openResultFolder"
            label="Open Result Folder"
          ></q-btn>

          <q-input
            outlined
            v-model="pluginDatas[currentPluginPos].pluginResultFileName"
            label="resultFileName"
          ></q-input>
          <!--<q-btn class = "result" color="primary" label="Run"></q-btn>-->
          <q-input id="result" v-model="currentResult" filled type="textarea" />

          <!-- 소스 텍스트 끝 -->
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
    let pluginDatas = reactive(window.apiNode.getPlugins("", {}));
    let pluginNameFilter = ref("");
    let currentPluginPos = ref(0);

    return {
      //quasar
      quasarFunction,
      // ui
      pluginDataTableColumns,
      pluginKeyValueTableColumns,
      // data
      pluginNameFilter,
      pluginDatas,
      currentPluginPos
    };
  },
  computed: {
    currentResult() {
      try {
        //
        let pluginJsonString = JSON.stringify(
          this.pluginDatas[this.currentPluginPos]
        );
        return window.apiNode.renderPluginResult(pluginJsonString);
      } catch (e) {
        console.log(e);
        return "none";
      }
    },
  },
  methods: {
    onRowClickPluginTable: function (evt, row, index) {
      this.currentPluginPos = index;
    },

    copyClipResult: function () {
      copyToClipboard(this.currentResult)
        .then(() => {
          this.quasarFunction.notify("Success");
        })
        .catch(() => {
          this.quasarFunction.notify("Fail");
        });
    },

    saveResultFile: function () {
      window.apiNode.saveFile({
        currentResult: this.currentResult,
        resultFileName:
          this.pluginDatas[this.currentPluginPos].pluginResultFileName,
      });
      this.quasarFunction.notify("File Save Success.");
    },

    openResultFolder: function () {
      window.apiNode.openResultFolder("", {});
    },

    openPluginFolder: function () {
      window.apiNode.openPluginFolder("", {});
    },

    refreshPlugins: function () {
      this.$router.go();
    },
  },
});
</script>

<style scoped>
div.col {
  padding-left: 10px;
}

p {
  font-size: large;
  font-weight: normal;
}
</style>

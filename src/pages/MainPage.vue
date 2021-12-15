<template>
  <q-page class="padding">
    <div class="q-pa-md">
      <div class="row">
        <div class="col">
          <!-- 플러그인 테이블 시작 -->
          <q-table
            id="presets"
            title="Presets"
            :rows="presetDatas"
            :columns="presetTableColumns"
            :filter="presetFilter"
            row-key="presetName"
            @row-click="onRowClickPluginTable"
          >
            <template v-slot:top-right>
              <div class="row">
                <div class="col">
                  <q-input
                    borderless
                    dense
                    debounce="300"
                    v-model="presetFilter"
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
            title="Preset Key Value"
            :rows="presetDatas[presetCurrentPos].presetKeyValue"
            :columns="presetKeyValueTableColumns"
            row-key="name"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="presetKey" :props="props">
                  {{ props.row.presetKey }}
                </q-td>
                <q-td key="presetKeyDesc" :props="props">
                  {{ props.row.presetKeyDesc }}
                </q-td>
                <q-td key="presetValue" :props="props">
                  <q-input
                    type="text"
                    v-model="props.row.presetValue"
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
            v-model="presetDatas[presetCurrentPos].presetResultFileName"
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
    const presetTableColumns = [
      {
        name: "presetName",
        align: "left",
        label: "presetName",
        field: "presetName",
      },
      {
        name: "presetDesc",
        align: "left",
        label: "presetDesc",
        field: "presetDesc",
      },
    ];

    const presetKeyValueTableColumns = [
      {
        name: "presetKey",
        align: "left",
        label: "presetKey",
        field: "presetKey",
      },
      {
        name: "presetKeyDesc",
        align: "left",
        label: "presetKeyDesc",
        field: "presetKeyDesc",
      },
      {
        name: "presetValue",
        align: "left",
        label: "presetValue",
        field: "presetValue",
      },
    ];

    // 데이터
    let presetDatas = reactive(window.apiNode.readPresets());
    let presetFilter = ref("");
    let presetCurrentPos = ref(0);

    return {
      //quasar
      quasarFunction,
      // ui
      presetTableColumns,
      presetKeyValueTableColumns,
      // data
      presetFilter,
      presetDatas,
      presetCurrentPos
    };
  },
  computed: {
    currentResult() {
      try {
        let presetCurrentData = this.presetDatas[this.presetCurrentPos];
        let presetCurrentDataJson = JSON.stringify(presetCurrentData);
        return window.apiNode.renderResult(presetCurrentDataJson);
      } catch (e) {
        console.log(e);
        return "none";
      }
    },
  },
  methods: {
    onRowClickPluginTable: function (evt, row, index) {
      this.presetCurrentPos = index;
    },

    copyClipResult: function () {
      copyToClipboard(this.currentResult)
        .then(() => {
          this.quasarFunction.notify("Clipboard Copy Success");
        })
        .catch(() => {
          this.quasarFunction.notify("Fail");
        });
    },

    saveResultFile: function () {
      window.apiNode.saveFile({
        currentResult: this.currentResult,
        resultFileName:
          this.presetDatas[this.presetCurrentPos].presetResultFileName,
      });
      this.quasarFunction.notify("File Save Success.");
    },

    openResultFolder: function () {
      window.apiNode.openResultFolder();
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

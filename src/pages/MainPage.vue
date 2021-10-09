<template>
  <q-page class="padding">
    <div class="q-pa-md">
      <div class="divide">
        <!-- 플러그인 테이블 시작 -->
        <q-table
          id = "plugin"
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
        <!-- 플러그인 테이블 끝 -->
      </div>
      <div class="divide">
        <!-- 키 값 테이블 시작 -->
        <q-table
          id = "pkv"
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
        <!-- 키 값 테이블 끝 -->
      </div>

      <div class="divide">
        <!-- 소스 텍스트 시작-->
        <q-btn class = "result" color="primary" @click="copyClipResult" label="Copy"></q-btn>
        <q-btn class = "result" color="primary" @click="saveResultFile" label="Save"></q-btn>
        <q-btn class = "result" color="primary" label="Run"></q-btn>
        <q-input id = "result" v-model="currentResult" filled type="textarea" />
        
        <!-- 소스 텍스트 끝 -->
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
        name: "pluginTag",
        align: "left",
        label: "pluginTag",
        field: "pluginTag",
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
    let pluginDatas = reactive(window.apiKvpPlugin.getKvpPlugins("", {}));
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
      currentPluginPos,
    };
  },
  computed: {
    currentResult() {
      try {
        let pluginSource = this.pluginDatas[this.currentPluginPos].pluginSource;
        let pluginKeyValue =
          this.pluginDatas[this.currentPluginPos].pluginKeyValue;
        for (let i = 0; i < pluginKeyValue.length; i++) {
          let pluginKey = pluginKeyValue[i].pluginKey;
          let pluginValue = pluginKeyValue[i].pluginValue;
          pluginKey = "$" + pluginKey + "$";
          pluginSource = pluginSource.replace(pluginKey, pluginValue);
        }
        return pluginSource;
      } catch (e) {
        console.log(e);
        return "none";
      }
    },
  },
  methods: {
    onRowClickPluginTable: function (evt, row, index) {
      this.currentPluginPos = index;
      this.currentResult = this.getCurrentSourceResult();
    },

    copyClipResult:function(){
      copyToClipboard(this.currentResult)
        .then(() => {
          this.quasarFunction.notify("Success");
        })
        .catch(() => {
          this.quasarFunction.notify("Fail");
        });
    },

    saveResultFile:function(){
      window.apiFile.saveFile("", {"data":this.currentResult})
    }
  },
});
</script>

<style scoped>


div.divide {
  float:left;
  padding: 10px;
  margin : 10px;
  width: 30%;
  height: 100%;
}

q-table#plugin{
  
}
q-table#pkv{
  
}
q-input#result{
  display: block;
}

q-btn.result{
  display: inline-block;
}

</style>

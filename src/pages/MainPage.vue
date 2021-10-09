<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <!-- 플러그인 테이블 시작 -->
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
        <!-- 플러그인 테이블 끝 -->


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
      currentPluginPos
    };
  },
  computed: {},
  methods: {
    onRowClickPluginTable: function (evt, row, index) {
      this.currentPluginPos = index;
    },
  },
});
</script>

<style scoped></style>

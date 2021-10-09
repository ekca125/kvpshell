<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md"></div>
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
  methods: {},
});
</script>

<style scoped></style>

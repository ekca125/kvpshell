<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          pkvcode
          <q-btn
            color="white"
            text-color="blue"
            label="Refresh"
            style="margin-left: 10px"
            @click="refreshPage"
          ></q-btn
        ></q-toolbar-title>

        <div>pkvcode 2.5.0</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />

        <PresetFolderLink
          v-for="link in presetFolderLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import PresetFolderLink from "src/components/PresetFolderLink.vue";

const linksList = [
  {
    title: "Github",
    caption: "github.com/ekca125/pkvcode",
    icon: "code",
    link: "https://github.com/ekca125/pkvcode",
  },
  {
    title: "Search Preset",
    caption: "Search Preset",
    icon: "code",
    link: "https://airtable.com/shrFOiIXatox1LCtJ",
  },
  {
    title: "Share Preset",
    caption: "Share Preset",
    icon: "code",
    link: "https://airtable.com/shrwsETCkg1uEto6W",
  },
];

const presetFolderLinks = [
  {
    title: "Open Preset Folder",
    caption: "Open Preset Folder",
    icon: "code",
    link: "None",
  },
];

import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    PresetFolderLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      presetFolderLinks: presetFolderLinks,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },

  methods: {
    refreshPage: function () {
      this.$router.go();
    },
  },
});
</script>

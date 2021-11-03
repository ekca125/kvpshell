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

        <q-toolbar-title> pkvcode <q-btn
          color="white"
          text-color="blue"
          label="Refresh"
          style="margin-left:10px"
          @click="refreshPluginPage"
        ></q-btn></q-toolbar-title>
        
        <div>pkvcode 2.3.0</div>
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

        <PluginFolderLink
          v-for="link in linksPluginFolderList"
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
import PluginFolderLink from "src/components/PluginFolderLink.vue";

const linksList = [
  {
    title: "Github",
    caption: "github.com/ekca125/pkvcode",
    icon: "code",
    link: "https://github.com/ekca125/pkvcode",
  },
  {
    title: "Search Plugin",
    caption: "Search Plugin",
    icon: "code",
    link: "https://seatable.ekcapaper.net/dtable/external-links/b33649a9f340452e9470/",
  },
  {
    title: "Share Plugin",
    caption: "Share Plugin",
    icon: "code",
    link: "https://seatable.ekcapaper.net/dtable/forms/6052ec13-f691-4a6e-af1e-a680c75e7028/",
  },
];

const linksPluginFolderList = [
  {
    title: "Open Plugin Folder",
    caption: "Open Plugin Folder",
    icon: "code",
    link: "None",
  },
];

import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    PluginFolderLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      linksPluginFolderList: linksPluginFolderList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },

  methods: {
    refreshPluginPage: function () {
      this.$router.go();
    },
  },
});
</script>

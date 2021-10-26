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

        <q-toolbar-title> KvpShell </q-toolbar-title>

        <div>KvpShell 2.0.0</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-btn
        class="result"
        color="white"
        text-color="black"
        style="width:100%"
        @click="openPluginFolder"
        label="Open Plugin Folder"
      ></q-btn>

      <q-list>
        <q-item-label header> Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
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

const linksList = [
  {
    title: "Github",
    caption: "github.com/ekca125/MoldShell",
    icon: "code",
    link: "https://github.com/ekca125/MoldShell",
  },
  {
    title: "Search Plugin",
    caption: "Plugin Website",
    icon: "code",
    link: "https://seatable.ekcapaper.net/dtable/external-links/5ee7d20d665c408ab11e/",
  },
  {
    title: "Share Plugin",
    caption: "Share Plugin",
    icon: "code",
    link: "https://seatable.ekcapaper.net/dtable/forms/6052ec13-f691-4a6e-af1e-a680c75e7028/",
  },
];

import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  methods: {
    openPluginFolder: function () {
      window.apiNode.openPluginFolder("", {});
    },
  },
});
</script>

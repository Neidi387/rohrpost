<template>
<v-layout class="rounded rounded-md border">
    <v-app-bar>
        <template v-slot:prepend>

        </template>
      <v-app-bar-title>
        mob2pc.com - App
      </v-app-bar-title>
      <template v-slot:append>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" location="right" temporary>
      <v-list>
        <v-list-item to="/">App</v-list-item>
        <v-list-item to="gdpr">Datenschutzerklärung</v-list-item>
        <v-list-item to="legal">Impressum</v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="d-flex align-stretch justify-stretch">
      <slot></slot>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
  const drawer = ref(false);
</script>

<style>
  html {
    overflow-y: hidden;
  }
</style>
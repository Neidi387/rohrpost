<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage>
      </NuxtPage>
    </NuxtLayout>
  </v-app>
</template>

<style>

</style>


<script setup lang="ts">
  import { init } from '@plausible-analytics/tracker';

  const domain = 'mob2pc.com';

  onMounted(() => {
    console.log('Domain: ', location.host);
    if (location.host.includes([domain])) {
      console.log('Init Plausible');
      init({
        domain: domain
      })
    }
  });

</script>
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

  const { init, track } = useLogging();
  const id = Math.random() < 0.5 ? 'A' : 'B';

  onMounted(async () => {
    await init();
    track('page-view', {props: { identety: id }});
  });

</script>
<template>
    Ich bin die Page
    <v-btn :to="{name: 'simpleRTCConnectionTest'}">Simple RTC Connection Test (Script)</v-btn>
    <v-btn :to="{name: 'signalingClassDevelopmentInterface'}">Signaling Class Development Interface</v-btn>
</template>

<script setup lang="ts">
    import type { tryAgainWithTimeout } from '~/utils/tryAgainWithTimeout';
</script>

<style scoped>

</style>
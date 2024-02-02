<template>
    <v-btn>Active Start</v-btn>
    <v-btn>Passive Start</v-btn>
</template>

<script setup lang="ts">
    const {$io} = useNuxtApp();

    $io.connect();

    $io.on(ESignaling.ON_PEER_MESSAGE, (message: number) => {
        counter.value = message;
    })

    watch(counter, () => {
        $io.emit(ESignaling.change, {value: counter.value});
    });

</script>

<style scoped>

</style>
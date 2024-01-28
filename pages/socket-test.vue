<template>
    <v-text-field type="number" v-model="counter"/>
</template>

<script setup lang="ts">
    const {$io} = useNuxtApp();

    $io.connect();

    const counter = ref(0);


    $io.on(SocketEvent.new_count, (message: number) => {
        counter.value = message;
    })

    watch(counter, () => {
        $io.emit(SocketEvent.change, {value: counter.value});
    });

</script>

<style scoped>

</style>
<template>
    <h2>Local Messages</h2>
    <p v-for="msg in localMessagesRecived">{msg}</p>;
    <h2>Remote Messages</h2>
    <p v-for="msg in remoteMessagesRecived">{msg}</p>;
</template>

<script setup lang="ts">
    const {localChannel, remoteChannel} = useRTCConnectionTestComposable();
    const remoteMessagesRecived = reactive<string[]>(['No remote messages yet...']);
    const localMessagesRecived = reactive<string[]>(['No local messages yet...']);
    localChannel.addEventListener('message', evt => localMessagesRecived.push(evt.data));
    remoteChannel.addEventListener('message', evt => remoteMessagesRecived.push(evt.data));
    localChannel.send('Test');
</script>

<style scoped>

</style>
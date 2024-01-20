<template>
    <h2>Local Messages</h2>
    <p v-for="msg in localMessagesRecived">{{msg}}</p>
    <h2>Remote Messages</h2>
    <p v-for="msg in remoteMessagesRecived">{{msg}}</p>
    <h2>Send Message</h2>
    <v-text-field v-model="text" label="Gib mal Nachricht ein"></v-text-field>
    <v-btn @click="sendMessage('local')">From Local</v-btn>
    <v-btn @click="sendMessage('remote')">From Remote</v-btn>
    <h2>Notes</h2>
    SSR must be disabled
</template>

<script setup lang="ts">
    const text = ref('');
    const {localChannel, remoteChannel, debugWebRTCJSONExamples} = useRTCConnectionTestComposable();
    const remoteMessagesRecived = reactive<string[]>(['No remote messages yet...']);
    const localMessagesRecived = reactive<string[]>(['No local messages yet...']);
    watchEffect(() => {
        if (undefined === localChannel.value || undefined === remoteChannel.value) {
            return;
        }
        localChannel.value.addEventListener('message', evt => {
            localMessagesRecived.push(evt.data);
        });
        remoteChannel.value.addEventListener('message', evt => {
            remoteMessagesRecived.push(evt.data);
        });
        // @ts-ignore
        window.debugWebRTCJSONExamples = debugWebRTCJSONExamples;
        console.log('WebRTC JSONs: ', debugWebRTCJSONExamples);
    });

    function sendMessage(from: 'local' | 'remote') {
        const sendChannel = {local: localChannel.value, remote: remoteChannel.value}[from];
        if (undefined === sendChannel) {
            alert('Warum ist denn das undefined???');
            return
        }
        console.log('Sending: "' + text.value + '"');
        sendChannel?.send(text.value);
        text.value = '';
    }

</script>

<style scoped>

</style>
<template>
    {{ dataChannel?.readyState ?? 'dc gibts ned' }}
    <RoleToggle v-if="!dataChannel">
        <template v-slot:active>
            <ActiveSignaling></ActiveSignaling>
        </template>
        <template v-slot:passive>
            <PassiveSignaling></PassiveSignaling>
        </template>
    </RoleToggle>
    <FileTransfer v-if="dataChannel"></FileTransfer>
</template>

<script setup lang="ts">

    const {dataChannel} = useRtcDataChannel();
    // const { dataChannel, connect } = useRtcDataChannelMock();
    // connect(); // Ensure this properly initializes the data channel using RTCPeerConnection
</script>
<style scoped>
  
</style>
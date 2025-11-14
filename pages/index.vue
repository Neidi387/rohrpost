<template>
    <v-container>
        <v-col class="d-flex justify-center">
            <v-sheet>
                <v-row class="justify-center">
                    <RoleToggle v-if="!dataChannel">
                        <template v-slot:active>
                            <ActiveSignaling></ActiveSignaling>
                        </template>
                        <template v-slot:passive>
                            <PassiveSignaling></PassiveSignaling>
                        </template>
                    </RoleToggle>
                </v-row>
            </v-sheet>
        </v-col>
        <FileTransfer v-if="dataChannel"></FileTransfer>
    </v-container>
</template>

<script setup lang="ts">
    definePageMeta({
        layout: 'app',
        title: 'mob2pc.com - Sende Dateien direkt im Browser',
    });
    const {dataChannel} = useRtcDataChannel();
    // const { dataChannel, connect } = useRtcDataChannelMock();
    // connect(); // Ensure this properly initializes the data channel using RTCPeerConnection
</script>
<style scoped>
  
</style>
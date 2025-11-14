<template>
    <v-container class="d-flex flex-column">
        <!-- <v-btn @click="dataChannel?.close()">Close DC</v-btn> -->
        <!-- <v-row class="flex-0-1">
            Bla bla Hier kannsch senden und empfangen
        </v-row> -->
        <v-row class="">
            <v-col cols="12" sm="6" class="file-transfer-component overflow-y-auto">
                <SendFiles></SendFiles>
            </v-col>
            <v-col cols="12" sm="6" class="file-transfer-component overflow-y-auto">
                <ReceiveFiles></ReceiveFiles>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
const { dataChannel } = useRtcDataChannel();

onUnmounted(() => {
    dataChannel.value?.close();
});

</script>

<style scoped>
    .file-transfer-component {
        height: 35vh;
    }
    @media screen and (min-width: 600px) {
        .file-transfer-component {
            height: 80vh;
        }
        
    }
</style>
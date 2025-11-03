<template>
    
    <v-card class="ma-5 pa-3" outlined>
        <v-card-title>
            Adresse
        </v-card-title>
        <v-card-subtitle>
            Gib diese Adresse auf dem anderen Gerät ein
        </v-card-subtitle>
        <v-card-text>
        <v-text-field
            v-model="address"
            label="Adresse"
            readonly
            outlined
            class="pointer-events-none"
        ></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" prepend-icon="mdi-content-copy" @click="copyToClipboard(address)">
                Kopieren
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
    import { useLongPollingSignalingChannel } from '~/composables/useLongPollingSignalingChannel';
    import { useRtcDataChannel } from '~/composables/useRtcDataChannel';

    const {openRoom, connect: connectSignaling, isConnected: isSignalingConnected, role, address} = useLongPollingSignalingChannel();
    const {connect: connectRtc} = useRtcDataChannel();

    role.value = 'passive';

    onBeforeMount(async () => {
        await openRoom();
        await connectSignaling();
        await connectRtc();
    });

    onUnmounted(async () => {
        isSignalingConnected.value = false;
    })

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
    }

</script>

<style scoped>

</style>
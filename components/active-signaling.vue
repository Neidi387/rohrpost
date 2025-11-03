<template>

<v-card class="ma-5 pa-3" outlined>
        <v-card-title>
            Adresse
        </v-card-title>
        <v-card-subtitle>
            Gib die Adresse ein, die auf dem anderen Gerät angezeigt wird
        </v-card-subtitle>
        <v-card-text>
            <v-text-field
                v-model="address"
                label="Adresse"
                outlined
                @keydown.enter="connect"
            ></v-text-field>
            </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="connect" append-icon="mdi-lan-connect">
                Verbinden 
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
    import { useLongPollingSignalingChannel } from '~/composables/useLongPollingSignalingChannel';

    const {connect: connectSignaling, isConnected: isSignalingConnected, role, address} = useLongPollingSignalingChannel();
    const {connect: connectRtc} = useRtcDataChannel();

    role.value = 'active';

    async function connect() {
        await connectSignaling();
        await connectRtc();
    }

    onUnmounted(async () => {
        isSignalingConnected.value = false;
    })

</script>

<style scoped>

</style>
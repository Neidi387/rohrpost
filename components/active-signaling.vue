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
                @keydown.enter="joinRoom(address, role)"
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
    const {joinRoom, close} = useLongPollingSignalingChannel();
    const {connect: connectRtc} = useRtcDataChannel();

    const address = ref('');
    role.value = 'active';

    async function connect() {
        await joinRoom(, address.toValue, );
        await connectRtc();
    }

    onUnmounted(async () => {
        await close();
    })

</script>

<style scoped>

</style>
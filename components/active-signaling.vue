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
                @keydown.enter="connect()"
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
    const {joinRoom, close, isRoomNotFoundException} = useLongPollingSignalingChannel();
    const {connectActive: connectRtcActive} = useRtcDataChannel();

    const address = ref('');

    async function connect() {
        try {
            await joinRoom(address.value, 'active');
        } catch (e) {
            if (isRoomNotFoundException(e)) {
                alert(("Raum nicht gefunden"));
                return;
            }
        }
        await connectRtcActive();
    }

    onUnmounted(async () => {
        await close();
    })

</script>

<style scoped>

</style>
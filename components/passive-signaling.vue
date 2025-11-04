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

    const {openRoom, isRoomNotFoundException, close, channel} = useLongPollingSignalingChannel();
    const {connectPassive: connectPassiveRtc } = useRtcDataChannel();

    const address = ref<string>('Initial');

    // TODO: Maybe wait here until room is created...
    onBeforeMount(async () => {
        try {
            address.value = 'Lädt...';
            await openRoom('passive', async (newAddress: string) => {
                address.value = 'Offer is here'
                await new Promise<void>((resolve) => setTimeout(resolve, 1000));
                console.log('An hier ist der Room erstellt und die Addresse wird angezeig. Aber der Channel ist nocht nicht instanziert.');
                address.value = newAddress;
            });
            console.log('Ab wird auf das ping vom active gewartet, danach existiert der Channel.');
        } catch (e) {
            if (isRoomNotFoundException(e)) {
                alert(("Raum nicht gefunden"));
                return;
            }
        }
        await connectPassiveRtc();
    });

    onUnmounted(async () => {
        await close();
    })

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
    }

</script>

<style scoped>

</style>
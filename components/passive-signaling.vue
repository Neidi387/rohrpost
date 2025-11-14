<template>
    <v-container>
        <v-card class="ma-5 pa-3" outlined>
    
            <v-card-title>
                Handy verbinden
            </v-card-title>
            <v-card-subtitle>
                Scan den QR-Code mit deinem Handy.
            </v-card-subtitle>
            <v-card-text>
                <v-sheet>
                    <v-row class="justify-center">
                        <img :src="qrCode" alt="">
                    </v-row>
                    <v-row class="justify-center">
                        <h1>
                            {{ address.split('').join(' ') }}
                        </h1>
                    </v-row>
                </v-sheet>
            </v-card-text>
            <v-card-subtitle>
                Oder gib diesen Code ein.
            </v-card-subtitle>
            <!-- <v-card-actions>
                <v-btn color="primary" prepend-icon="mdi-content-copy" @click="copyToClipboard(address)">
                    Kopieren
                </v-btn>
            </v-card-actions> -->
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
    import { useLongPollingSignalingChannel } from '~/composables/useLongPollingSignalingChannel';
    import { useRtcDataChannel } from '~/composables/useRtcDataChannel';
    import { useQRCode } from '@vueuse/integrations/useQRCode'

    const abortOffer: Ref<() => void> = ref()

    const {openRoom, isRoomNotFoundException, close, channel} = useLongPollingSignalingChannel();
    const {connectPassive: connectPassiveRtc } = useRtcDataChannel();

    const address = ref<string>('...');
    const url = computed(() => `${location.origin}?role=active&room=${address.value}`);
    const qrCode = useQRCode(url);

    // TODO: Maybe wait here until room is created...
    onBeforeMount(async () => {
        try {
            await openRoom('passive', async (newAddress: string, abortOfferFn: () => void) => {
                address.value = newAddress;
                abortOffer.value = abortOfferFn;
            });
        } catch (e) {
            if (isRoomNotFoundException(e)) {
                alert(("Raum nicht gefunden"));
                return;
            }

        }
        await connectPassiveRtc();
    });

    onUnmounted(async () => {
        try {
            abortOffer?.value();
            await close();
        } catch(e) {
            if (isRoomNotFoundException(e)) {
                console.log('Room already closed');
                return;
            }
        }
    })

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
    }

</script>

<style scoped>

</style>
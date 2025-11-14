<template>

<v-card class="ma-5 pa-3" outlined>
        <v-card-title>
            Computer verbinden
        </v-card-title>
        <v-card-subtitle>
            Gib den Code ein, der auf dem Computer angezeigt wird.
        </v-card-subtitle>
        <v-card-text>
            <v-text-field
                v-model="address"
                label="Adresse"
                outlined
                @input="address = address.toUpperCase().replaceAll(' ', '').trim()"
                :disabled="isValidAddress"
            ></v-text-field>
            </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { a } from '@vueuse/integrations/index-BgoBW25H.js';

    const {joinRoom, close, isRoomNotFoundException} = useLongPollingSignalingChannel();
    const {connectActive: connectRtcActive} = useRtcDataChannel();

    const route = useRoute();
    const address = ref('');

    onMounted(() => {
        if (route.query.room && 'string' === typeof route.query.room) {
            address.value = route.query.room;
        }
    });

    watch(address, async () => {
        if (false === isValidAddress.value) {
            return;
        }
        try {
            await joinRoom(address.value, 'active');
        } catch (e) {
            if (isRoomNotFoundException(e)) {
                return;
            }
            address.value = '';
        }
        try {
            await connectRtcActive();
        } catch (e) {
            address.value = '';
        }
    });

    onUnmounted(async () => {
        try {
            await close();
        } catch(e) {
            if (isRoomNotFoundException(e)) {
                console.log('Room already closed');
                return;
            }
        }
    })

    const isValidAddress = computed(() => {
        return /^[A-Z]{4}$/.test(address.value);
    });

</script>

<style scoped>

</style>
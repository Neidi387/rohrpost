<template>
    <div>
        <h2>Active Signaling</h2>
        <form @submit.prevent="startSignaling">
            <label>
                Adresse
                <input type="text" v-model="address">
            </label>
            <input type="submit">
        </form>
    </div>
</template>

<script setup lang="ts">
    import type { TSignalingRegistry } from '#build/types/nitro-imports';
    import { useRtcDataChannel } from '~/composables/useRtcDataChannel';
    import { ESignalingSocketIo } from "~/utils/signaling-socket.io/ESignalingSocketIo";

    const address = ref('');
    const {rtcConnectActive} = useRtcDataChannel();
    const {$io} = useNuxtApp();
    $io.connect();
    function startSignaling() {
        const msg: TSignalingRegistry = {
            role: 'active',
            address: address.value,
        };
        $io.emit(ESignalingSocketIo.ON_REGISTER_MESSAGE, msg);
        rtcConnectActive($io);
    }
</script>

<style scoped>

</style>
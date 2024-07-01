<template>
    <div>
        <h2>Passive Signaling</h2>
        {{ address }}
    </div>
</template>

<script setup lang="ts">
    import type { TSignalingRegistry } from '#build/types/nitro-imports';
    import { useRtcDataChannel } from '~/composables/useRtcDataChannel';
    import { ESignalingSocketIo } from "~/utils/signaling-socket.io/ESignalingSocketIo";


    const address = ref(getRandomString(5));
    const {rtcConnectPassive} = useRtcDataChannel();
    const {$io} = useNuxtApp();
    const msg: TSignalingRegistry = {
        role: 'passive',
        address: address.value,
    };
    $io.connect();
    setTimeout(() => {
        $io.emit(ESignalingSocketIo.ON_REGISTER_MESSAGE, msg);
        rtcConnectPassive($io);
    }, 100)
</script>

<style scoped>

</style>
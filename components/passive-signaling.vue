<template>
    <div>
        <h2>Passive Signaling</h2>
        {{ address }}
    </div>
</template>

<script setup lang="ts">
    import { useRtcDataChannel } from '~/composables/useRtcDataChannel';
import { useSocketIOSignalingChannel } from '~/composables/useSocketIOSignalingChannel';


    const address = ref(getRandomString(5));
    const {rtcConnectPassive} = useRtcDataChannel();
    const {signalingChannel, signalingChannnelAproach, abortSignalingChannnelAproach} = useSocketIOSignalingChannel();

    onMounted( () => {
        signalingChannnelAproach('passive', address.value);
    } );

    watch(signalingChannel, () => {
        if (null === signalingChannel.value) 
            return;
        rtcConnectPassive(signalingChannel.value);
    })

</script>

<style scoped>

</style>
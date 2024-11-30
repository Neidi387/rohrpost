<template>
    <div>
        <h2>Passive Signaling</h2>
        {{ address }}
    </div>
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

</script>

<style scoped>

</style>
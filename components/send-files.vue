<template>
    <div>
        <h1>File Senden</h1>
        <input :key="updateKey" ref="fileInput" type="file" @input="sendFile">
        <p v-if="progress">Slice {{ progress.iCurrentSlice }} / {{ progress.sliceCount }}</p>
        <progress v-if="progress" min="0" :max="progress.sliceCount" :value="progress.iCurrentSlice"></progress>
    </div>
</template>

<script lang="ts" setup>
    import { useRtcDataChannel } from '~/composables/useRtcDataChannel';

    const {dataChannel} = useRtcDataChannel();

    const progress = ref<{
        sliceCount: number,
        iCurrentSlice: number,
    }>();

    const fileInput = ref<HTMLInputElement>();
    const updateKey = ref(0);
    const metaData = ref<{
        name: string,
        size: number,
        type: string,
        lastModified: number,
    }>();

    async function sendFile() {
        if( !fileInput.value?.files?.length ) {
            return
        }
        const file = fileInput.value.files[0];
        const sliceSize = useRuntimeConfig().public.rtcDataChannel.maxPacketSize;
        metaData.value = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
        };
        dataChannel.value?.send(`Metadata:${JSON.stringify(metaData.value)}`);
        progress.value = {
            iCurrentSlice: 0,
            sliceCount: Math.ceil(file.size / sliceSize)
        };
        for(; progress.value.iCurrentSlice < progress.value.sliceCount; progress.value.iCurrentSlice++) {
            const pReady = getPChannelReadyForNextSlice();
            const sliceFrom = progress.value.iCurrentSlice * sliceSize;
            const sliceTo = Math.min((progress.value.iCurrentSlice + 1) * sliceSize, file.size)
            const pArrayBuffer = file.slice(sliceFrom, sliceTo).arrayBuffer();
            const arrayBuffer = await pArrayBuffer;
            await pReady;
            dataChannel.value?.send(arrayBuffer);
        }
        fileInput.value.value = '';
        updateKey.value++;
    }

    function getPChannelReadyForNextSlice() {
        return new Promise(res => {
            dataChannel.value?.addEventListener('bufferedamountlow', res);
        });
    }
</script>

<style lang="scss" scoped>

</style>
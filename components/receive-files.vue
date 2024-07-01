<template>
    <div>
        <h1>Erhaltenes File</h1>
        <p v-if="progress">Slice {{ progress.iCurrentSlice }} / {{ progress.sliceCount }}</p>
        <a v-if="href" :href="href" download>{{ metaData?.name }}</a>
        <progress v-if="progress" min="0" :max="progress.sliceCount" :value="progress.iCurrentSlice"></progress>
    </div>
</template>

<script setup lang="ts">
    import { useRtcDataChannel } from '~/composables/useRtcDataChannel';

    const progress = ref<{
        sliceCount: number,
        iCurrentSlice: number,
    }>();

    const metaData = ref<{
        name: string,
        size: number,
        type: string,
        lastModified: number,
    }>();

    const {rtcDataChannel} = useRtcDataChannel();

    const href = ref();
    
    rtcDataChannel.value?.addEventListener('message', async evt => {
        if ( 'string' !== typeof evt.data || false === /^Metadata:/.test(evt.data) ) {
            return
        }
        const metaDataJson = evt.data.replace(/^Metadata:/, '');
        metaData.value = JSON.parse(metaDataJson);
        progress.value = {
            iCurrentSlice: 0,
            sliceCount: Math.ceil(metaData.value!.size / useRuntimeConfig().public.rtcDataChannel.maxPacketSize),
        };
        let isDone = false;
        const slices: ArrayBuffer[] = [];
        let resolvePDone: () => void;
        const pDone = new Promise<void>(res => resolvePDone = res);
        rtcDataChannel.value?.addEventListener('message', evt => {
            if( isDone ) {
                return
            }
            if ( false === evt.data instanceof ArrayBuffer ) {
                return
            }
            slices[progress.value!.iCurrentSlice++] = evt.data;
            isDone = progress.value!.iCurrentSlice === progress.value!.sliceCount;
            if (isDone) {
                resolvePDone();
            }
        });
        await pDone;
        const file = new File(slices, metaData.value!.name, metaData.value );
        href.value = URL.createObjectURL(file);
    })

</script>

<style scoped>

</style>
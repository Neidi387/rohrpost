<template>
    <div>
        <h1>File Senden</h1>
        <input :key="updateKey" multiple ref="fileInput" type="file" @input="sendFile">
        <ul>
            <li v-for="file in fileStore.send">
                <ul>
                    <li>
                        {{ file.meta.name }}
                    </li>
                    <li>
                        <progress
                            v-if="'progress' === file.state"
                            min="0"
                            max="100"
                            :value="progress?.percentage"></progress>
                    </li>
                </ul>                
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
    import { useFilesStore } from '~/stores/files';
    import { useSendFileComposable } from '~/composables/useSendFileComposable';

    const fileStore = useFilesStore();
    const { enqueueFiles, progress } = useSendFileComposable();

    // const progress = ref<{
    //     sliceCount: number,
    //     iCurrentSlice: number,
    // }>();

    const fileInput = ref<HTMLInputElement>();
    const updateKey = ref(0);

    async function sendFile() {
        if( !fileInput.value?.files?.length ) {
            return
        }
        enqueueFiles([...fileInput.value.files]);
        fileInput.value.value = '';
        updateKey.value++;
    }


</script>

<style lang="scss" scoped>

</style>
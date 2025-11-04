<template>
    <div ref="dropZoneRef">

        <v-icon>mdi-email-outline</v-icon>
        <v-icon>mdi-arrow-right-bold-outline</v-icon>
        <label>
            Dateien hierher ziehen oder Dateien durchsuchen
            <input :key="updateKey" multiple ref="fileInput" type="file" @input="sendFile" style="display: none;">
        </label>

        <v-list lines="two" style="max-height: 40vh; overflow-y: auto;">
            <v-list-item v-for="file in fileStore.send" :key="file.identifier" color="primary">
                <template v-slot:prepend>
                    <v-icon v-if="'queue' === file.state" color="orange">mdi-email-arrow-right-outline</v-icon>
                    <v-icon v-if="'progress' === file.state" color="blue">mdi-email-fast-outline</v-icon>
                    <v-icon v-if="'done' === file.state" color="green">mdi-email-check-outline</v-icon>
                </template>
                <v-list-item-title>
                    {{ file.meta.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    <span v-if="'progress' === file.state">{{ fileSizeFormatter((progress!.iSlice /
                        progress!.sliceCount) *
                        file.meta.size ) }} / </span>
                    {{ fileSizeFormatter(file.meta.size) }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                    <v-progress-linear v-if="'progress' === file.state" :model-value="progress?.percentage"
                        color="blue">
                    </v-progress-linear>
                    <v-progress-linear v-if="'progress' !== file.state" color="blue" :style="{ visibility: 'hidden' }">
                    </v-progress-linear>
                </v-list-item-subtitle>
                <!-- <template v-slot:append>
                    <v-list-item-action>
                        <v-btn icon="mdi-information-outline"></v-btn>
                    </v-list-item-action>
                </template> -->
            </v-list-item>
        </v-list>
    </div>
</template>

<script lang="ts" setup>
// import { useFilesStoreMock } from '~/stores/test/files_mock';
// const fileStore = useFilesStoreMock();
import { useSendFileComposable } from '~/composables/useSendFileComposable';
import { useDropZone } from '@vueuse/core';

const dropZoneRef = ref<HTMLDivElement>();

const fileStore = useFilesStore();


const { enqueueFiles, progress } = useSendFileComposable();

const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop,
    // control multi-file drop
    multiple: true,
    // whether to prevent default behavior for unhandled events
    preventDefaultForUnhandled: false,
});
// const progress = ref({
//     sliceCount: 100,
//     iSlice: 24,
//     percentage: 24,
// });

// const fileStore = useFilesStore();
// const { enqueueFiles, progress  } = useSendFileComposable();

const fileInput = ref<HTMLInputElement>();
const updateKey = ref(0);

async function sendFile() {
    if (!fileInput.value?.files?.length) {
        return
    }
    enqueueFiles([...fileInput.value.files]);
    fileInput.value.value = '';
    updateKey.value++;
}

function onDrop(files: File[] | null) {
    console.log(files);
    if (null === files) {
        return
    }
    enqueueFiles([...files]);

}

</script>

<style lang="scss" scoped></style>
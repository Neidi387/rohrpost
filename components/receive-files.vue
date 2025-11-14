<template>
    <v-sheet elevation="4" class="fill-height overflow-hidden">
        <v-container elevation="4" class="fill-height overflow-hidden">
            <v-icon>mdi-arrow-right-bold-outline</v-icon>
            <v-icon>mdi-mailbox-outline</v-icon>
            <v-list class="file-transfer-list overflow-auto">
                <v-list-item 
                    v-for="file in fileStore.receive"
                    :key="file.identifier"
                    color="primary">
                    <template v-slot:prepend>
                        <v-icon v-if="'queue' ===file.state" color="orange">mdi-email-arrow-left-outline</v-icon>
                        <v-icon v-if="'progress' ===file.state" color="blue">mdi-email-fast-outline</v-icon>
                        <v-icon v-if="'done' ===file.state"  color="green">mdi-email-check-outline</v-icon>
                    </template>
                    <v-list-item-title class="list-item-filename">
                        {{ file.meta.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <span v-if="'progress' === file.state">{{ fileSizeFormatter((progress!.iSlice / progress!.sliceCount) * file.meta.size) }} / </span>
                        {{ fileSizeFormatter(file.meta.size) }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                        <v-progress-linear 
                            v-if="'progress' === file.state"
                            :model-value="progress?.percentage"
                            color="blue">
                        </v-progress-linear>
                        <v-progress-linear 
                            v-if="'progress' !== file.state"
                            color="blue"
                            :style="{ visibility: 'hidden' }">
                        </v-progress-linear>
                    </v-list-item-subtitle>
                    <template v-slot:append>
                        <v-list-item-action>
                            <v-btn
                                v-if="file.file"
                                :href="getObjectUrl(file.file)"
                                :download="file.meta.name"
                                icon
                                elevation="0"
                            >
                                <v-icon color="primary">mdi-download</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </template>
                </v-list-item>
            </v-list>
        </v-container>
    </v-sheet>
</template>

<script setup lang="ts">
    import { useReceiveFileComposable } from '~/composables/useReceiveFileComposable';
    
    const fileStore = useFilesStore();

    const {listen, unlisten, progress } = useReceiveFileComposable();

    const activeFile = computed(() => fileStore.receive.find(file => file.state === 'progress'));    

    function getObjectUrl(file: File): string {
        return URL.createObjectURL(file);
    }

    onMounted(() => {
        listen();
    });

    onUnmounted(() => {
        unlisten();
    });
</script>

<style scoped>
    .file-transfer-list {
        height: 30vh;
    }
    .list-item-filename {
        width: 50vw;
    }
    @media screen and (min-width: 600px) {
        .file-transfer-list {
            height: 60vh;
        }
        .list-item-filename {
            width: 20vw;
        }
        
    }
</style>
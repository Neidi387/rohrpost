<template>
    <div>
        <h1>Erhaltenes File</h1>
        <ul>
            <li v-for="file in fileStore.receive">
                <br>
                <progress
                    v-if="'progress' === file.state"
                    min="0"
                    max="100"
                    :value="progress?.percentage"></progress>
                <a v-if="file.file" :href="getObjectUrl(file.file)" :download="file.meta.name">{{ file.meta.name }}</a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { useReceiveFileComposable } from '~/composables/useReceiveFileComposable';
    import { useFilesStore } from '~/stores/files';

    const fileStore = useFilesStore();
    const {listen, unlisten, progress} = useReceiveFileComposable();

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

</style>
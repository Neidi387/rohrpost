<template>
    Send
    <div>
        <input type="file" multiple @input="onInput">
    </div>
    Files Out
    <table>
        <thead>
            <th>Index</th>
            <th>Name</th>
            <th>Type</th>
            <th>Size</th>
            <th>Last Modified</th>
            <th>Progress</th>
            <th>Done</th>
        </thead>
        <tbody>
            <tr v-for="file, index in fileInfoListOut">
                <td>{{ index }}</td>
                <td>{{ file.name }}</td>
                <td>{{ file.type }}</td>
                <td>{{ file.size }}</td>
                <td>{{ file.lastModified }}</td>
                <td>
                    <progress 
                        :max="file.iCurrentSlice / file.iLastSclice" 
                        value="file.iCurrentSlice">
                    </progress>
                </td>
                <td>{{ file.isDone ? 'Fertisch' : 'Nonet' }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
    import { FileInfo } from '~/utils/dataChannel/FileInfo';
    import { EMetaMessageName } from '~/utils/dataChannel/IMetaMessage';

    const props = defineProps<{
        dataChannels: {
            meta: RTCDataChannel,
            data: RTCDataChannel,
        }
    }>();

    const fileListOut = ref<FileList>(new FileList());
    const fileInfoListOut = computed(() => FileInfo.fromFileList(fileListOut.value));

    function onInput(payload: Event) {
        const fileList = (payload.currentTarget as HTMLInputElement).files;
        if ( null === fileList ) {
            return
        }
        fileListOut.value = fileList;
    }

    watchEffect(async () => {
        if ( undefined === fileInfoListOut.value || undefined === fileListOut.value ) {
            return;
        }
        const fileInfoJson = JSON.stringify( fileInfoListOut.value );
        const pFileInfoListReceivedAcknowledged: Promise<void> = new Promise((res, rej) => props.dataChannels.meta.addEventListener('message', evt => {
            if ( EMetaMessageName.ACKNOWLEDGE_FILE_INFO_LIST in evt.data ) {
                res();
            } else {
                rej();
            }
        }));
        props.dataChannels.meta.send( fileInfoJson );
        const fileInfoAcknowledgeMessage = await pFileInfoListReceivedAcknowledged;
        while(fileInfoListOut.value.every(fileInfo => fileInfo.isDone)) {
            // const pAcknowledge
            /**
             * 1) Create Acknowledge Promise
             * 2) Send Announcement
             * 3) Send Data
             * 4) Wait for Acknowledge Promise
             */
        }
    })

</script>

<style scoped>

</style>
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
    import { EMetaMessageName, type IMetaFileAcknowledge, type IMetaFileAnnounced, type IMetaFileInfoAnnouncement } from '~/utils/dataChannel/IMetaMessage';

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
        const pFileInfoListReceivedAcknowledged: Promise<void> = new Promise( res => props.dataChannels.meta.addEventListener('message', evt => {
            if ( EMetaMessageName.ACKNOWLEDGE_FILE_INFO_LIST === evt.data.name ) {
                res();
                return
            }
        }));
        const fileInfoListAnnouncement: IMetaFileInfoAnnouncement = {
            name: EMetaMessageName.ANNOUNCE_FILE_INFO_LIST,
            fileInfoList: fileInfoListOut.value
        }
        props.dataChannels.meta.send( JSON.stringify(fileInfoListAnnouncement) );
        /*const fileInfoAcknowledgeMessage =*/ await pFileInfoListReceivedAcknowledged;
        while(fileInfoListOut.value.every(fileInfo => fileInfo.isDone)) {
            for( const fileInfo of fileInfoListOut.value ) {
                const file = fileListOut.value[fileInfo.index];
                for( fileInfo.iCurrentSlice; fileInfo.iCurrentSlice <= fileInfo.iLastSclice; fileInfo.iCurrentSlice++ ) {
                    const pFileAcknowledge = new Promise<IMetaFileAcknowledge>( res => props.dataChannels.meta.addEventListener('message', evt => {
                            if (EMetaMessageName.ACKNOWLEDGE_FILE_SLICE_RECEIVED === evt.data.name) {
                                res(evt.data);
                                return
                            }
                        })
                    );
                    const fileAnnouncement: IMetaFileAnnounced = {
                        name: EMetaMessageName.ANNOUNCE_FILE_SLICE_SENT,
                        state: {
                            index: fileInfo.index,
                            slice: fileInfo.iCurrentSlice
                        }
                    };
                    const slice = 'Test Slice ' + fileInfo.iCurrentSlice;
                    props.dataChannels.meta.send(JSON.stringify(fileAnnouncement));
                    props.dataChannels.data.send(slice);
                    await pFileAcknowledge;
                }
            }
        }
    })

</script>

<style scoped>

</style>
<template>
    Send
    <div>
        <input type="file" multiple @input="onInput">
    </div>
    Files Out
    <table>
        <thead>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Size</th>
            <th>Last Modified</th>
            <th>Progress</th>
            <th>Done</th>
        </thead>
        <tbody>
            <tr v-for="fileInfo in fileInfoListOut">
                <td>{{ fileInfo.id }}</td>
                <td>{{ fileInfo.name }}</td>
                <td>{{ fileInfo.type }}</td>
                <td>{{ fileInfo.size }}</td>
                <td>{{ fileInfo.lastModified }}</td>
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

    const fileListOut = ref<FileList | null>(null);
    const fileInfoListOut = computed(() => fileListOut.value ? FileInfo.fromFileList(fileListOut.value) : null );

    function onInput(payload: Event) {
        const fileList = (payload.currentTarget as HTMLInputElement).files;
        if ( null === fileList ) {
            return
        }
        fileListOut.value = fileList;
    }

    watch(fileListOut, async () => {
        if ( null === fileInfoListOut.value || null === fileListOut.value ) {
            return;
        }
        const pFileInfoListReceivedAcknowledged: Promise<void> = new Promise( res => props.dataChannels.meta.addEventListener('message', evt => {
            const msg = JSON.parse(evt.data);
            if ( EMetaMessageName.ACKNOWLEDGE_FILE_INFO_LIST === msg.name ) {
                res();
                return
            }
        }));
        const fileInfoListAnnouncement: IMetaFileInfoAnnouncement = {
            name: EMetaMessageName.ANNOUNCE_FILE_INFO_LIST,
            fileInfoList: fileInfoListOut.value
        }
        debugger
        props.dataChannels.meta.send( JSON.stringify(fileInfoListAnnouncement) );
        await pFileInfoListReceivedAcknowledged;
        debugger
        for( const fileInfo of fileInfoListOut.value ) {
            const file = fileListOut.value[fileInfo.index];
            for( fileInfo.iCurrentSlice; fileInfo.iCurrentSlice <= fileInfo.iLastSclice; fileInfo.iCurrentSlice++ ) {
                const pFileAcknowledge = new Promise<IMetaFileAcknowledge>( res => props.dataChannels.meta.addEventListener('message', evt => {
                        const msg = JSON.parse(evt.data);
                        if (EMetaMessageName.ACKNOWLEDGE_FILE_SLICE_RECEIVED === msg.name ) {
                            res(msg);
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
                const slice = 'Test Slice ' + fileInfo.iCurrentSlice + ' of file ' + file.name;
                debugger
                props.dataChannels.meta.send(JSON.stringify(fileAnnouncement));
                props.dataChannels.data.send(slice);
                await pFileAcknowledge;
                debugger
            }
        }
        // fileListOut.value = null;
    })

</script>

<style scoped>

</style>
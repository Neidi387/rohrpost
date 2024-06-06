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
            <SendFile 
                v-for="fileInfo in fileInfoListOut" 
                :fileInfo="fileInfo" 
                :key="fileInfo.id"
                :dataChannels="dataChannels"
            ></SendFile>
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

    const fileInfoList = reactive<FileInfo[]>([]);

    const fileList = ref<FileList | null>(null)
    const fileIdCurrentSending = computed(computeFileIdCurrentSending);

    watch(fileList, expandFileInfoList);

    // TODO: Überlegen wie ich das regle, dass die nächste Datei gesendet wird

    function onInput(payload: Event) {
        const fileList = (payload.currentTarget as HTMLInputElement).files;
    }

    function expandFileInfoList() {
        if (null === fileList.value) {
            return
        }
        const fileInfoListNew = FileInfo.fromFileList(fileList.value);
        fileInfoList.concat(fileInfoListNew);
    }

    function computeFileIdCurrentSending() {
        const filesInfoNotSend = fileInfoList.filter(fileInfo => false === fileInfo.isDone && true === fileInfo.isReadyToTransfer);
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
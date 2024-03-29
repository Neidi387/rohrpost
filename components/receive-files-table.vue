<template>
    Received
    <table>
        <thead>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Size</th>
            <th>Last Modified</th>
            <th>Progress</th>
            <th>Download</th>
        </thead>
        <tbody>
            <tr v-for="fileInfo in fileInfoListIn">
                <td>{{ fileInfo.id }}</td>
                <td>{{ fileInfo.name }}</td>
                <td>{{ fileInfo.type }}</td>
                <td>{{ fileInfo.size }}</td>
                <td>{{ fileInfo.lastModified }}</td>
                <td>
                    <progress 
                        :max="fileInfo.iCurrentSlice / fileInfo.iLastSclice" 
                        value="file.iCurrentSlice">
                    </progress>
                </td>
                <td v-if="fileInfo.isDone"><a :href="blobToObjectURL( fileInfoFileMap.get(fileInfo)! )" download="">Klick</a></td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
    import { FileInfo } from '~/utils/dataChannel/FileInfo';
    import { EMetaMessageName, type IMetaFileAcknowledge, type IMetaFileAnnounced, type IMetaFileInfoAcknowledge, type IMetaFileInfoAnnouncement, type IMetaMessage, type TMetaMessage } from '~/utils/dataChannel/IMetaMessage';
    import { blobToObjectURL } from '~/utils/blobToObjectURL';

    const props = defineProps<{
        dataChannels: {
            meta: RTCDataChannel,
            data: RTCDataChannel,
        }
    }>();

    const fileInfoListIn = ref<FileInfo[]>([] as FileInfo[]);
    const fileInfoFileMap = ref<Map<FileInfo, File>>(new Map());

    props.dataChannels.meta.addEventListener('message', async evt => {
        const msg: TMetaMessage = JSON.parse(evt.data);
        if ( EMetaMessageName.ANNOUNCE_FILE_INFO_LIST != msg.name ) {
            return
        };
        const acknowledgeFileInfo: IMetaFileInfoAcknowledge = {
            name: EMetaMessageName.ACKNOWLEDGE_FILE_INFO_LIST,
        };
        debugger
        props.dataChannels.meta.send(JSON.stringify(acknowledgeFileInfo));
        fileInfoListIn.value = (msg as IMetaFileInfoAnnouncement).fileInfoList;
        for( const fileInfo of fileInfoListIn.value ) {
            const buffer = [];
            for( fileInfo.iCurrentSlice; fileInfo.iCurrentSlice <= fileInfo.iLastSclice; fileInfo.iCurrentSlice++ ) {
                debugger
                const pSliceAnnouncement: Promise<IMetaFileAnnounced> = new Promise(res => props.dataChannels.meta.addEventListener('message', evt =>{
                    const msg = JSON.parse( evt.data );
                    if( EMetaMessageName.ANNOUNCE_FILE_SLICE_SENT === msg.name ) {
                        res(msg);
                        return
                    }
                }));
                const pSlice: Promise<string> = new Promise<string>(res => props.dataChannels.data.addEventListener('message', evt => res(evt.data)));
                const [announcement, slice] = await Promise.all([pSliceAnnouncement, pSlice]);
                debugger
                buffer.push(slice);
                const acknowledge: IMetaFileAcknowledge = {
                    name: EMetaMessageName.ACKNOWLEDGE_FILE_SLICE_RECEIVED,
                    state: {
                        index: fileInfo.index,
                        slice: fileInfo.iCurrentSlice
                    },
                }
                debugger
                props.dataChannels.meta.send(JSON.stringify(acknowledge));
            }
            debugger
            const file = new File(buffer, fileInfo.name, fileInfo);
            fileInfoFileMap.value.set(fileInfo, file);
        }
    })

</script>

<style scoped>

</style>
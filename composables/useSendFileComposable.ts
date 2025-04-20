import { useFilesStore, type IFile } from "~/stores/files";
import { initializeNextFile } from "./useSendFileComposable/initializeNextFile";
import { finishActiveFile } from "./useSendFileComposable/finishActiveFile";
import { sendSlice } from "./useSendFileComposable/sendSlice";
import { createMetaMessage } from "./useSendFileComposable/createMetaMessage";

const _state = reactive<I_State>({
    isRunning: false,
    activeFile: null,
});

const isRunning = computed(() => _state.isRunning);
const progress = computed(() => {
    if( null === _state.activeFile ) {
        return null;
    } else {
        return {
            sliceCount: _state.activeFile.sliceCount,
            iSlice: _state.activeFile.iSlice,
            percentage: 100 * ((_state.activeFile.iSlice + 1) / _state.activeFile.sliceCount)
        }
    }
});

export function useSendFileComposable() {
    return {
        enqueueFiles,
        isRunning,
        progress,
    }
}

// Adds Files to the files store. Send a message to the remote peer announcing the files.
function enqueueFiles(files: File[]) {
    const filesStore = useFilesStore();
    const {dataChannel} = useRtcDataChannel();
    if (null === dataChannel.value) {
        throw Error('Datachannel is null');
    }
    const filesStoreFormat: IFile[] = files.map(file => {
        return {
            identifier: Math.random().toString(36).substring(2),
            state: 'queue',
            file: file,
            meta: {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
            }
        }
    });
    filesStoreFormat.forEach(file => {
        filesStore.send.push(file);
    } );
    const metaMessage = createMetaMessage(filesStoreFormat);
    dataChannel.value.send(metaMessage);
    // TODO: Check if already running before start
    start();
}

/**
 * Start the sending progress. 
 * Sending continues while isRUnning is true.
 * 
 */
async function start() {
    if (_state.isRunning) {
        throw Error('Already running')
    }
    const filesStore = useFilesStore();
    const {dataChannel} = useRtcDataChannel();    
    const MAX_SLICE_SIZE = useRuntimeConfig().public.rtcDataChannel.maxPacketSize;
    _state.isRunning = true;
    while(_state.isRunning) {
        console.log('--- Send file Loop: START ---');
        if (null === dataChannel.value) {
            throw Error('Datachannel is null');
        }
        if ( null === _state.activeFile ) {
            try {
                initializeNextFile(filesStore, dataChannel.value, MAX_SLICE_SIZE, _state);
            } catch (error: any) {
                if (error.message === 'No enqueued files') {
                    stop();
                    console.log('--- Send file Loop: STOP ---');
                    return;
                }
            }
        }
        await sendSlice(dataChannel.value, _state, MAX_SLICE_SIZE);
        console.log(`--- SLICE SENT. Slice number: ${_state.activeFile?.iSlice} from ${_state.activeFile?.sliceCount} ---`);
        // The loop has to repeat faster, than the datachannels bufferedammount gets low!
        if (_state.activeFile!.iSlice === _state.activeFile!.sliceCount - 1) {
            finishActiveFile(filesStore, dataChannel.value, MAX_SLICE_SIZE, _state);
            console.log('--- FILE FINISHED ---');
        }
        // Count up only at the end of all progress
        if ( _state.activeFile ) {
            _state.activeFile.iSlice++;
        }
        console.log('--- Send file Loop: END ---');
    }
}

// Stops the sending progress. 
function stop() {
    _state.isRunning = false;
}

export interface I_State {
    isRunning: boolean;
    activeFile: {
        identifier: string;
        sliceCount: number;
        iSlice: number;
        file: File;
    } | null;
}
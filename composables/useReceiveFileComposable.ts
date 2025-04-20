import { useFilesStore, type IFile, type IFileStore } from "~/stores/files";
import { parseMetaMessage } from "./useReceiveFileComposable/parseMetaMessage";

const _state = reactive<IState>({
    isRunning: false,
    eventHandlerFn: null,
    activeFile: null
});

const isRunning = computed(() => _state.isRunning);
const progress = computed(() => {
    if( null === _state.activeFile ) {
        return null;
    } else {
        return {
            sliceCount: _state.activeFile.sliceCount,
            iSlice: _state.activeFile.iSlice,
            percentage: 100 * ((_state.activeFile.iSlice + 1) / _state.activeFile.sliceCount )
        }
    }
});
export function useReceiveFileComposable() {
    
    return {
        listen,
        unlisten,
        isRunning,
        progress
    }
}

/**
 * Listen for incoming files.
 * Adds datachannel Eventlistener for meta messages and data.
 * 
 */
function listen() {
    const { dataChannel } = useRtcDataChannel();
    if (null === dataChannel.value) {
        throw Error('Datachannel is null');
    }
    _state.isRunning = true;
    _state.eventHandlerFn = getEventHandlerFn(useFilesStore(), _state);
    dataChannel.value.addEventListener('message', _state.eventHandlerFn);
}

function getEventHandlerFn(fileStore: IFileStore, _state: IState) {
    return (event: MessageEvent) => {
        const data = event.data;
        console.log('Received message:', data);
        if (data instanceof ArrayBuffer) {
            handleDataMessage(event, _state);
        } else if (data.startsWith('Meta:')) {
            handleMetaMessage(event, fileStore, _state);
        }
    }
}

async function handleDataMessage(event: MessageEvent, _state: IState) {
    const data = event.data;
    if (null === _state.activeFile) {
        throw Error('No active file');
    }
    _state.activeFile.iSlice++;
    _state.activeFile.buffer.push(data);
}

function handleMetaMessage(event: MessageEvent, fileStore: IFileStore, _state: IState) {
    const data = event.data;
    const MAX_SLICE_SIZE = useRuntimeConfig().public.rtcDataChannel.maxPacketSize;
    if (typeof data === 'string' && data.startsWith('Meta:')) {
        const files = parseMetaMessage(data);
        files.forEach(messagedFile => {
            if (messagedFile.state === 'queue' && undefined === fileStore.receive.find(storedFile => storedFile.identifier === messagedFile.identifier)) {
                fileStore.receive.push({
                    identifier: messagedFile.identifier,
                    state: messagedFile.state,
                    file: null,
                    meta: messagedFile.meta
                });
            }
            // Does this destroy reactivity?
            const storedFile = fileStore.receive.find(storedFile => storedFile.identifier === messagedFile.identifier);
            if (storedFile === undefined)
                throw Error('File not found');
            storedFile.state = messagedFile.state;
            storedFile.meta = {
                name: messagedFile.meta.name,
                size: messagedFile.meta.size,
                type: messagedFile.meta.type,
                lastModified: messagedFile.meta.lastModified,
            };
            if (messagedFile.state === 'progress') {
                if (_state.activeFile !== null) {
                    throw Error('File already active');
                }
                _state.activeFile = {
                    identifier: messagedFile.identifier,
                    sliceCount: Math.ceil(messagedFile.meta.size / MAX_SLICE_SIZE),
                    iSlice: 0,
                    file: null,
                    buffer: []
                };
            }
            if (messagedFile.state === 'done') {
                if (_state.activeFile === null) {
                    throw Error('No active file');
                }
                if (_state.activeFile.identifier !== messagedFile.identifier) {
                    throw Error('Wrong file');
                }
                const file = new File(_state.activeFile.buffer, storedFile.meta.name, storedFile.meta);
                storedFile.file = file;
                _state.activeFile = null;
            }
        });
    }
}

/**
 * Stop listening for incoming files.
 * Removes datachannel Eventlistener for meta messages and data.
 */
function unlisten() {
    _state.isRunning = false;
    const { dataChannel } = useRtcDataChannel();
    if (null === dataChannel.value) {
        throw Error('Datachannel is null');
    }
    if (null === _state.eventHandlerFn) {
        throw Error('No event handler function');
    }
    dataChannel.value.removeEventListener('message', _state.eventHandlerFn);
}

interface IState {
    isRunning: boolean;
    eventHandlerFn: ((event: MessageEvent) => void) | null;
    activeFile: {
        identifier: string;
        sliceCount: number;
        iSlice: number;
        file: File | null;
        buffer: ArrayBuffer[];
    } | null;
}
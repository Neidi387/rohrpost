import { defineStore } from "pinia";

export const useConnectionStore = defineStore<'files', IFileStore>({
    id: 'files',
    state: () => {
        const state: IFileStore = {
            receive: [],
            send: []
        }
        return state;
    }
})

interface IFileStore {
    receive: IFile[];
    send: IFile[];
}

interface IFile {
    id: string;
    progress: {
        iSlices: 0;
        iCurrent: 0;
    }
    buffer: string[];
    file?: Blob;
}
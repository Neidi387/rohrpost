import { defineStore } from "pinia";

export const useFilesStore = defineStore<'files', IFileStore>({
    id: 'files',
    state: () => {
        const state: IFileStore = {
            receive: [],
            send: []
        }
        return state;
    }
})

export interface IFileStore {
    receive: IFile[];
    send: IFile[];
}

export interface IFile {
    identifier: string;
    state: 'queue' | 'progress' | 'done';
    file: File | null;
    meta: IMeta;
}

interface IMeta {
    name: string,
    size: number,
    type: string,
    lastModified: number,
}

// interface IFileOut {
//     identifier: string;
//     state: 'queue' | 'sending' | 'finished';
//     file: File;
//     meta: IMeta;
// }

// interface IFileIn {
//     identifier: string;
//     state: 'queue' | 'receiving' | 'finished';
//     file: File | null;
//     meta: IMeta;
// }
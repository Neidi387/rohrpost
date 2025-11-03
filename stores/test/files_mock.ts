export const useFilesStoreMock = defineStore<'files', IFileStore>({
    id: 'files',
    state: () => {
        const state: IFileStore = {
            receive: [
                {
                    identifier: '1',
                    state: 'queue',
                    file: null,
                    meta: {
                        name: 'file1.txt',
                        size: 1024,
                        type: 'text/plain',
                        lastModified: Date.now()
                    }
                },
                {
                    identifier: '2',
                    state: 'progress',
                    file: null,
                    meta: {
                        name: 'file2.txt',
                        size: 2048,
                        type: 'text/plain',
                        lastModified: Date.now()
                    }
                },
                {
                    identifier: '3',
                    state: 'done',
                    file: new File(['content'], 'file3.txt', {
                        type: 'text/plain',
                        lastModified: Date.now()
                    }),
                    meta: {
                        name: 'file3.txt',
                        size: 3072,
                        type: 'text/plain',
                        lastModified: Date.now()
                    }
                }
            ],
            send: [{
                identifier: '4',
                state: 'queue',
                file: new File(['content'], 'file4.txt', {
                    type: 'text/plain',
                    lastModified: Date.now()
                }),
                meta: {
                    name: 'file4.txt',
                    size: 4096,
                    type: 'text/plain',
                    lastModified: Date.now()
                } }, {
                    identifier: '5',
                    state: 'progress',
                    file: new File(['content'], 'file5.txt', {
                        type: 'text/plain',
                        lastModified: Date.now()
                    }),
                    meta: {
                        name: 'file5.txt',
                        size: 5120,
                        type: 'text/plain',
                        lastModified: Date.now()
                } }, {
                    identifier: '6',
                    state: 'done',
                    file: new File(['content'], 'file6.txt', {
                        type: 'text/plain',
                        lastModified: Date.now()
                }),
                    meta: {
                        name: 'file6.txt',
                        size: 6144,
                        type: 'text/plain',
                        lastModified: Date.now()
                }
            }]
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
import type { IFile } from "~/stores/files";

export function getMetaMessage( files: IFile[] ): string {
    const filesSerialized: IFileSerialized[] = files.map(file => {
        const fileSerialized = {
            identifier: file.identifier,
            state: file.state,
            meta: file.meta,
        };
        return fileSerialized;
    });
    return `Meta:${JSON.stringify(filesSerialized)}`;
}

interface IFileSerialized {
    identifier: string;
    state: 'queue' | 'progress' | 'done';
    meta: IFile['meta'];
};
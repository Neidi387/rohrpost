import type { IFile } from "~/stores/files";

export function parseMetaMessage(msg: string): IFileSerialized[] {
    const json = msg.replace('Meta:', '');
    const files: IFile[] = JSON.parse(json);
    return files;
}

interface IFileSerialized {
    identifier: string;
    state: 'queue' | 'progress' | 'done';
    meta: IFile['meta'];
};
 
import type { FileInfo } from "./FileInfo";

export enum EMetaMessageName {
    FILE_INFO_LIST = 'file-info-list',
    FILE_INFO_LIST_RECEIVED = 'file-info-list-received',
    FILE_SEND_START = 'file_start_sending',
    FILE_RECEIVED_END = 'file_finished_receiving',
}

export type TMetaMessage = IFileInfoListMsg | IFileInfoListReceivedMsg | IFileSendStart | IFileReceivedEnd;

interface IMetaMessage {
    name: EMetaMessageName.FILE_INFO_LIST | EMetaMessageName.FILE_INFO_LIST_RECEIVED | EMetaMessageName.FILE_SEND_START | EMetaMessageName.FILE_RECEIVED_END;
}

export interface IFileInfoListMsg extends IMetaMessage {
    name: EMetaMessageName.FILE_INFO_LIST;
    fileInfoList: FileInfo[];
}

export interface IFileInfoListReceivedMsg extends IMetaMessage {
    name: EMetaMessageName.FILE_INFO_LIST_RECEIVED;
    fileInfoList: FileInfo[];
}

export interface IFileSendStart extends IMetaMessage {
    name: EMetaMessageName.FILE_SEND_START;
    id: string;
}

export interface IFileReceivedEnd extends IMetaMessage {
    name: EMetaMessageName.FILE_RECEIVED_END,
    id: string;
}
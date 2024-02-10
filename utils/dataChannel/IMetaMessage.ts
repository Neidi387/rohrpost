export enum EMetaMessageName {
    ACKNOWLEDGE_FILE_INFO_LIST = 'acknowledge-file-info-list',
    ACKNOWLEDGE_FILE_SLICE_RECEIVED = 'acknowledge-file-slice-received',
    ANNOUNCE_FILE_SLICE_SENT = 'announce-file-slice-sent'
}

export interface IMetaMessage {
    name: 'acknowledge-file-info-list' | 'acknowledge-file-slice-received' | 'announce-file-slice-sent'
}

export interface IMetaFileInfoAcknowledge extends IMetaMessage {
    name: 'acknowledge-file-info-list';
}

export interface IMetaFileAcknowledge extends IMetaMessage {
    name: 'acknowledge-file-slice-received';
    state: {
        index: number;
        slice: number;
    };
}

export interface IMetaFileAnnounced extends IMetaMessage {
    name: 'announce-file-slice-sent';
    state: {
        index: number;
        slice: number;
    };
}
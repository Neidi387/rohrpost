export class FileInfo {
    static MAX_SLICE_LENGTH = 16 * 8 * 2 ** 10; // 16 KiB

    static fromFileList(fileList: FileList): FileInfo[] {
        const FileInfoList: FileInfo[] = [];
        for (const file of fileList) {
            const fileInfo = new FileInfo(
                'send',
                file.name,
                file.type,
                file.size,
                file.lastModified,
                file
            );
            FileInfoList.push(fileInfo);
        }
        return FileInfoList
    }

    static fromFileInfoStripped( fileInfoStrippedList: IFileInfoStripped[] ) {
        const FileInfoList: FileInfo[] = [];
        for (const file of fileInfoStrippedList) {
            const fileInfo = new FileInfo(
                'receive',
                file.name,
                file.type,
                file.size,
                file.lastModified,
                null
            );
            FileInfoList.push(fileInfo);
        }
        return FileInfoList
    }

    readonly iLastSclice: number;
    iCurrentSlice = 0;
    isReadyToTransfer = false;

    private constructor(
            readonly mode: 'send' | 'receive',
            readonly name: string,
            readonly type: string,
            readonly size: number,
            readonly lastModified: number,
            public file: Blob | null
    ) {
        this.iLastSclice = Math.ceil(this.size / FileInfo.MAX_SLICE_LENGTH);
    }

    toJSON(): string {
        return JSON.stringify({
            name: this.name,
            type: this.type,
            size: this.size,
            lastModified: this.lastModified,
        })
    }

    get id(): string {
        return `name="${this.name}" time="${this.lastModified}"`
    }

    get isDone(): boolean {
        return this.iCurrentSlice === this.iLastSclice
    }
}

export interface IFileInfoStripped {
    readonly index: number;
    readonly name: string;
    readonly type: string;
    readonly size: number;
    readonly lastModified: number;
    readonly id: string;
}
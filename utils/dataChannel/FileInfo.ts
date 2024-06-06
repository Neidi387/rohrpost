export class FileInfo {
    static MAX_SLICE_LENGTH = 2 ** 8;

    static fromFileList(fileList: FileList): FileInfo[] {
        const FileInfoList: FileInfo[] = [];
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            FileInfoList.push(new FileInfo(file, i));
        }
        return FileInfoList
    }

    static fromFileInfoStripped( fileInfoStrippedList: IFileInfoStripped[] ) {
        const FileInfoList: FileInfo[] = [];
        for (let i = 0; i < fileInfoStrippedList.length; i++) {
            const file = fileInfoStrippedList[i];
            FileInfoList.push(new FileInfo(file, i));
        }
        return FileInfoList
    }

    readonly index: number;
    readonly name: string;
    readonly type: string;
    readonly size: number;
    readonly lastModified: number;

    readonly iLastSclice: number;
    iCurrentSlice = 0;
    isDone = false;


    private constructor(file: File | IFileInfoStripped, index: number) {
        this.index = index;
        this.name = file.name;
        this.type = file.type;
        this.size = file.size;
        this.lastModified = file.lastModified;
        this.iLastSclice = Math.ceil(this.size / FileInfo.MAX_SLICE_LENGTH);
    }

    toJSON(): string {
        return JSON.stringify({
            index: this.index,
            name: this.name,
            type: this.type,
            size: this.size,
            lastModified: this.lastModified,
        })
    }

}

export interface IFileInfoStripped {
    readonly index: number;
    readonly name: string;
    readonly type: string;
    readonly size: number;
    readonly lastModified: number;
}
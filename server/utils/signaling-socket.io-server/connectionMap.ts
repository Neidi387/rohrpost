import { Socket } from "socket.io";

export const connectionMap = new Map<string, IEntry>();

export interface IEntry {
    address: string;
    passive: Socket;
    active: Socket | null;
}
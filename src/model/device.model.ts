export interface Device {
    id : number;
    code: string;
    ip: string;
    created: string;
    recyclingProcessList: number;
    recyclingProcessCount: number;
    state: boolean;
}
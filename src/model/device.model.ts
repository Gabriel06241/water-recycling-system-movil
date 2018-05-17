export interface Device {
    id : number;
    code: string;
    ip: string;
    created: string;
    recyclingProcessList: Array<any>;
    state: boolean;
}
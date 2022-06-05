
export interface ISsh {
    sshId: number;
    Username: string;
    IpAddress: string;
}

export type ISshCreate = Omit<ISsh, 'sshId'>;
export type ISshUpdate = Partial<ISshCreate>;
export type ISshRO = Readonly<ISsh>;
interface IStatusContract {
    ok: object;
    err: object;
}

interface IServiceStatus {
    id: string;
    name: string;
    version: string
    url: string,
    lastOk: number,
    lastError: string,
    envInfo: string,
    lastPingDuration: string,
    started: number
}
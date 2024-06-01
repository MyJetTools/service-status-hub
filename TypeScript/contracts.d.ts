declare const $;

interface IStatusContract {
    ok: object;
    err: object;
}

interface IServiceStatus {
    id: string;
    name: string;
    version: string;
    git_hub_version: string;
    to_release_version: string;
    url: string,
    lastOk: number,
    lastError: string,
    envInfo: string,
    lastPingDuration: string,
    started: number
}
class HtmlMain {
    static layout() {
        return '<div id="main"></div>' +
            HtmlStatusBar.layout();
    }
    static generateContent(status) {
        let prevId = "";
        let result = "";
        for (let key of Object.keys(status.err)) {
            let value = status.err[key];
            result += `<h1 style="color:red;">${key}:${value}</h1>`;
        }
        result += '<table class="table table-striped">' +
            '<thead><tr><th>Id</th><th>Env</th><th>Name</th><th>Version</th><th>Url</th><th>EnvInfo</th><th>Last Ok Ping</th><th>LastError</th><th>Last ping duration</th></tr></thead>' +
            '<tbody>';
        let tableBottom = '</tbody></table>';
        let ok = "";
        let servicesCount = 0;
        let versionsToBeUpdated = 0;
        for (let domain of Object.keys(status.ok)) {
            ok += '<tr><td colspan="9"><h2>' + domain + '</h2></td>' +
                '</tr>';
            let appIds = status.ok[domain];
            for (let appId of Object.keys(appIds)) {
                let envs = appIds[appId];
                let warning = `<img src="/img/env.png" style="width:16px"/>`;
                let prevVersion = "";
                for (let env of Object.keys(envs)) {
                    let service = envs[env];
                    if (prevVersion == "") {
                        prevVersion = service.version;
                    }
                    else {
                        if (prevVersion != service.version) {
                            warning = `<img src="/img/warning.png" style="width:24px"/>`;
                        }
                    }
                    let started = "???";
                    if (service.started) {
                        started = new Date(service.started / 1000).toLocaleString();
                    }
                    let serviceIdToPrint = "";
                    if (prevId != service.id) {
                        serviceIdToPrint = service.id;
                        prevId = service.id;
                    }
                    let releaseColor = "black";
                    if (service.git_hub_version != service.version || service.to_release_version != service.version) {
                        releaseColor = "red";
                        versionsToBeUpdated++;
                    }
                    let git_hub_version = `<div><img src="/img/release.svg" style="width:16px; height:16px"/>${service.to_release_version}</div><div><img src="/img/github.svg" style="width:16px; height:16px"/>${service.git_hub_version}</div>`;
                    if (service.lastOk >= 5) {
                        ok += '<tr style="background:red">' +
                            '<td>' + serviceIdToPrint + '</td>' +
                            '<td>' + env + '</td>' +
                            '<td>' + service.name + '</td>' +
                            `<td style="color:${releaseColor}">` + warning + service.version + git_hub_version + '</td>' +
                            `<td><div>` + service.url + '</div><div> Started: ' + started + '</div></td>' +
                            '<td>' + service.envInfo + '</td>' +
                            '<td>' + service.lastOk + ' sec ago</td>' +
                            '<td>' + service.lastError + '</td>' +
                            '<td>' + service.lastPingDuration + '</td>' +
                            '</tr>';
                    }
                    else {
                        ok += '<tr>' +
                            '<td>' + serviceIdToPrint + '</td>' +
                            '<td>' + env + '</td>' +
                            '<td>' + service.name + '</td>' +
                            `<td style="color:${releaseColor}">` + warning + service.version + git_hub_version + '</td>' +
                            '<td><div>' + service.url + '</div><div> Started: ' + started + '</div></td>' +
                            '<td>' + service.envInfo + '</td>' +
                            '<td>' + service.lastOk + ' sec ago</td>' +
                            '<td>' + service.lastError + '</td>' +
                            '<td>' + service.lastPingDuration + '</td>' +
                            '</tr>';
                    }
                    servicesCount++;
                }
            }
        }
        HtmlStatusBar.updateServicesAmount(servicesCount);
        HtmlStatusBar.updateVersionsToBeUpdated(versionsToBeUpdated);
        return result + ok + tableBottom;
    }
}
//# sourceMappingURL=HtmlMain.js.map
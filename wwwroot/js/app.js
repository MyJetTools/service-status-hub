// HtmlValue.js
class HtmlStaticElement {
    constructor(el, toString) {
        this.el = el;
        this.toString = toString;
    }
    update(value) {
        if (this.value === undefined || this.value != value) {
            this.value = value;
            this.el.innerHTML = this.toString(value);
        }
    }
}

// HtmlMain.js
class HtmlMain {
    static layout() {
        return '<div id="main"></div>' +
            HtmlStatusBar.layout() +
            `<div id="header"><input class="form-control" style="width:400px" oninput="AppContext.onFilterChange(this)"/></div>`;
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
            let appIds = status.ok[domain];
            if (!AppContext.filterIsDisabled()) {
                let everythingIsFiltered = true;
                for (let appId of Object.keys(appIds)) {
                    let envs = appIds[appId];
                    for (let env of Object.keys(envs)) {
                        let service = envs[env];
                        if (AppContext.showItem(service)) {
                            everythingIsFiltered = false;
                            break;
                        }
                    }
                    if (!everythingIsFiltered) {
                        break;
                    }
                }
                if (everythingIsFiltered) {
                    continue;
                }
            }
            ok += '<tr><td colspan="9"><h2>' + domain + '</h2></td>' +
                '</tr>';
            for (let appId of Object.keys(appIds)) {
                let envs = appIds[appId];
                let warning = `<img src="/img/env.png" style="width:16px"/>`;
                let prevVersion = "";
                for (let env of Object.keys(envs)) {
                    let service = envs[env];
                    if (!AppContext.showItem(service)) {
                        continue;
                    }
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

// HtmlStatusBar.js
class HtmlStatusBar {
    static getConnected() {
        if (this.connected === undefined) {
            this.connected = new HtmlStaticElement(document.getElementById('connected'), (value) => value ? '<span style="color:green">Connected</span>' : '<span style="color:red">Disconnected</span>');
        }
        return this.connected;
    }
    static getServicesAmount() {
        if (this.servicesAmount === undefined) {
            this.servicesAmount = new HtmlStaticElement(document.getElementById('services-amount'), (value) => value.toFixed(0));
        }
        return this.servicesAmount;
    }
    static getVersionsToBeUpdate() {
        if (this.versionsToBeUpdated === undefined) {
            this.versionsToBeUpdated = new HtmlStaticElement(document.getElementById('versions-to-be-updated'), (value) => {
                if (value == 0) {
                    return value.toFixed(0);
                }
                return `<span style="color:red">${value.toFixed(0)}</span>`;
            });
        }
        return this.versionsToBeUpdated;
    }
    static layout() {
        return '<div id="status-bar">' +
            '<table><tr>' +
            '<td style="padding-left: 5px">Connected: <b id="connected" style="text-shadow: 0 0 2px white;"></b></td>' +
            '<td><div class="statusbar-separator"></div></td>' +
            '<td>Total Services: <b id="services-amount" style="text-shadow: 0 0 1px white;"></b></td>' +
            '<td><div class="statusbar-separator"></div></td>' +
            '<td>Versions to be updated: <b id="versions-to-be-updated" style="text-shadow: 0 0 1px white;"></b></td>' +
            '<td><div class="statusbar-separator"></div></td>' +
            '</tr></table></div>';
    }
    static updateVersionsToBeUpdated(value) {
        this.getVersionsToBeUpdate().update(value);
    }
    static updateServicesAmount(value) {
        this.getServicesAmount().update(value);
    }
    static updateOffline() {
        this.getConnected().update(false);
    }
    static updateOnline() {
        this.getConnected().update(true);
    }
}

// main.js
class AppContext {
    static filterIsDisabled() {
        return this.filterString == "";
    }
    static showItem(item) {
        if (this.filterIsDisabled()) {
            return true;
        }
        if (item.id.toLocaleLowerCase().includes(this.filterString)) {
            return true;
        }
        return false;
    }
    static onFilterChange(element) {
        AppContext.filterString = element.value.toLowerCase();
    }
    static resize() {
        let height = window.innerHeight;
        let width = window.innerWidth;
        if (this.windowHeight == height && this.windowWidth == width)
            return;
        this.windowHeight = height;
        this.windowWidth = width;
        let sbHeight = this.statusBarHeight;
        this.layoutElement.setAttribute('style', this.generatePosition(0, 0, width, height - sbHeight));
        this.statusBarElement.setAttribute('style', 'position:absolute; ' + this.generatePosition(0, height - sbHeight, width, sbHeight));
    }
    static generatePosition(left, top, width, height) {
        return 'top:' + top + 'px; left:' + left + 'px; width:' + width + 'px; height:' + height + 'px';
    }
    static background() {
        if (!this.body) {
            this.body = document.getElementsByTagName('body')[0];
            this.body.innerHTML = HtmlMain.layout();
            this.layoutElement = document.getElementById('main');
            this.statusBarElement = document.getElementById('status-bar');
        }
        this.resize();
        if (this.requested)
            return;
        this.requested = true;
        $.ajax({ url: '/api/status', type: 'get' })
            .then((result) => {
            this.requested = false;
            this.layoutElement.innerHTML = HtmlMain.generateContent(result);
            HtmlStatusBar.updateOnline();
        }).fail(() => {
            this.requested = false;
            HtmlStatusBar.updateOffline();
        });
    }
}
AppContext.filterString = "";
AppContext.requested = false;
AppContext.statusBarHeight = 24;
window.setInterval(() => AppContext.background(), 1000);


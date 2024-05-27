var HtmlMain = /** @class */ (function () {
    function HtmlMain() {
    }
    HtmlMain.layout = function () {
        return '<div id="main"></div>' +
            HtmlStatusBar.layout();
    };
    HtmlMain.generateContent = function (status) {
        var prevId = "";
        var result = "";
        for (var _i = 0, _a = Object.keys(status.err); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = status.err[key];
            result += "<h1 style=\"color:red;\">".concat(key, ":").concat(value, "</h1>");
        }
        result += '<table class="table table-striped">' +
            '<thead><tr><th>Id</th><th>Env</th><th>Name</th><th>Version</th><th>Url</th><th>EnvInfo</th><th>Last Ok Ping</th><th>LastError</th><th>Last ping duration</th></tr></thead>' +
            '<tbody>';
        var tableBottop = '</tbody></table>';
        var ok = "";
        var servicesCount = 0;
        for (var _b = 0, _c = Object.keys(status.ok); _b < _c.length; _b++) {
            var domain = _c[_b];
            ok += '<tr><td colspan="9"><h2>' + domain + '</h2></td>' +
                '</tr>';
            var appIds = status.ok[domain];
            for (var _d = 0, _e = Object.keys(appIds); _d < _e.length; _d++) {
                var appId = _e[_d];
                var envs = appIds[appId];
                var warning = "";
                var prevVersion = "";
                for (var _f = 0, _g = Object.keys(envs); _f < _g.length; _f++) {
                    var env = _g[_f];
                    var service = envs[env];
                    if (prevVersion == "") {
                        prevVersion = service.version;
                    }
                    else {
                        if (prevVersion != service.version) {
                            warning = "<img src=\"/img/warning.png\" style=\"width:24px\"/>";
                        }
                    }
                    var started = "???";
                    if (service.started) {
                        started = new Date(service.started / 1000).toLocaleString();
                    }
                    var serviceIdToPrint = "";
                    if (prevId != service.id) {
                        serviceIdToPrint = service.id;
                        prevId = service.id;
                    }
                    var releaseColor = "black";
                    if (service.git_hub_version != service.version || service.to_release_version != service.version) {
                        releaseColor = "red";
                    }
                    var git_hub_version = "<div><img src=\"/img/github.svg\" style=\"width:16px; height:16px\"/>".concat(service.git_hub_version, "</div><div><img src=\"/img/release.svg\" style=\"width:16px; height:16px\"/>").concat(service.to_release_version, "</div>");
                    if (service.lastOk >= 5) {
                        ok += '<tr style="background:red">' +
                            '<td>' + serviceIdToPrint + '</td>' +
                            '<td>' + env + '</td>' +
                            '<td>' + service.name + '</td>' +
                            "<td style=\"color:".concat(releaseColor, "\">") + warning + service.version + git_hub_version + '</td>' +
                            "<td><div>" + service.url + '</div><div> Started: ' + started + '</div></td>' +
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
                            "<td style=\"color:".concat(releaseColor, "\">") + warning + service.version + git_hub_version + '</td>' +
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
        return result + ok + tableBottop;
    };
    return HtmlMain;
}());
//# sourceMappingURL=HtmlMain.js.map
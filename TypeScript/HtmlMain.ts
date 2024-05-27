class HtmlMain {
    public static layout(): string {
        return '<div id="main"></div>' +
            HtmlStatusBar.layout();
    }


    public static generateContent(status: IStatusContract): string {

        let prevId = "";
        let result = "";
        for (let key of Object.keys(status.err)) {
            let value = status.err[key];
            result += `<h1 style="color:red;">${key}:${value}</h1>`;
        }


        result += '<table class="table table-striped">' +
            '<thead><tr><th>Id</th><th>Env</th><th>Name</th><th>Version</th><th>Url</th><th>EnvInfo</th><th>Last Ok Ping</th><th>LastError</th><th>Last ping duration</th></tr></thead>' +
            '<tbody>';
        let tableBottop = '</tbody></table>'
        let ok = "";

        let servicesCount = 0


        for (let domain of Object.keys(status.ok)) {

            ok += '<tr><td colspan="9"><h2>' + domain + '</h2></td>' +
                '</tr>';

            let appIds = status.ok[domain];




            for (let appId of Object.keys(appIds)) {
                let envs = appIds[appId];

                let warning = ``;

                let prevVersion = "";

                for (let env of Object.keys(envs)) {

                    let service: IServiceStatus = envs[env];

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

                    if (service.lastOk >= 5) {
                        ok += '<tr style="background:red">' +
                            '<td>' + serviceIdToPrint + '</td>' +
                            '<td>' + env + '</td>' +

                            '<td>' + service.name + '</td>' +
                            '<td>' + warning + service.version + '</td>' +
                            '<td><div>' + service.url + '</div><div> Started: ' + started + '</div></td>' +
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
                            '<td>' + warning + service.version + '</td>' +
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
    }
}
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
        if (this.servicesAmount === undefined) {
            this.servicesAmount = new HtmlStaticElement(document.getElementById('versions-to-be-updated'), (value) => {
                if (value == 0) {
                    return value.toFixed(0);
                }
                return `<span style="color:red">${value.toFixed(0)}</span>`;
            });
        }
        return this.servicesAmount;
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
//# sourceMappingURL=HtmlStatusBar.js.map
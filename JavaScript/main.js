class AppContext {
    static filterIsDisabled() {
        return this.filterString == "" && !this.checkedDifferent;
    }
    static showItem(item) {
        if (this.filterIsDisabled()) {
            return true;
        }
        if (this.checkedDifferent) {
            return item.version != item.git_hub_version;
        }
        if (item.id.toLocaleLowerCase().includes(this.filterString)) {
            return true;
        }
        return false;
    }
    static onFilterChange(element) {
        AppContext.filterString = element.value.toLowerCase();
    }
    static onCheckboxClick(element) {
        AppContext.checkedDifferent = element.checked;
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
AppContext.checkedDifferent = false;
AppContext.requested = false;
AppContext.statusBarHeight = 24;
window.setInterval(() => AppContext.background(), 1000);
//# sourceMappingURL=main.js.map
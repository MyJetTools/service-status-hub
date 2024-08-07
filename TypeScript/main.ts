class AppContext {

    public static filterString = "";

    public static checkedDifferent = false;

    private static body: HTMLElement;
    private static layoutElement: HTMLElement;
    private static statusBarElement: HTMLElement;
    private static requested = false;



    private static windowHeight: number;
    private static windowWidth: number;

    private static statusBarHeight = 24;


    static filterIsDisabled(): boolean {
        return this.filterString == "" && !this.checkedDifferent;
    }

    static showItem(item: IServiceStatus): boolean {

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

    static onFilterChange(element: HTMLInputElement) {
        AppContext.filterString = element.value.toLowerCase();
    }

    static onCheckboxClick(element: HTMLInputElement) {
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

        this.layoutElement.setAttribute('style',
            this.generatePosition(0, 0, width, height - sbHeight));

        this.statusBarElement.setAttribute('style',
            'position:absolute; ' + this.generatePosition(0, height - sbHeight, width, sbHeight))

    }

    static generatePosition(left: number, top: number, width: number, height: number): string {
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
            .then((result: IStatusContract) => {
                this.requested = false;

                this.layoutElement.innerHTML = HtmlMain.generateContent(result);


                HtmlStatusBar.updateOnline();

            }).fail(() => {
                this.requested = false;
                HtmlStatusBar.updateOffline();
            })

    }

}

window.setInterval(() => AppContext.background(), 1000);
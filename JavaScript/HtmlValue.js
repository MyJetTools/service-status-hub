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
//# sourceMappingURL=HtmlValue.js.map
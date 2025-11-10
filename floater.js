// Floater.js

Floater.elements = [];

function Floater(options = {}) {
    this._template = document.querySelector(`#${options.template}`);
    this.opt = Object.assign(
        {
            closeMethods: ["button", "overlay", "escape"],
            destroyOnClose: true,
            footer: true,
            cssClass: [],
        },
        options
    );

    if (!this._template) {
        console.error("No template has existed");
    }
    this._allowButtonClose = this.opt.closeMethods.includes("button");
    this._allowBackdropClose = this.opt.closeMethods.includes("overlay");
    this._allowEscapeClose = this.opt.closeMethods.includes("escape");
    this._footerButtons = [];
    this._escape = this._escape.bind(this);
}
Floater.prototype._getScrollbarWidth = function () {
    if (this._scrollbarWidth) return this._scrollbarWidth;

    const scrollDiv = document.createElement("div");
    scrollDiv.style.overflow = "scroll";
    scrollDiv.style.position = "absolute";
    scrollDiv.style.top = "-9999px"; // Position off-screen to avoid visual impact

    // Append to the document body
    document.body.appendChild(scrollDiv);

    // Calculate the scrollbar width
    this._scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    // Remove the temporary div
    document.body.removeChild(scrollDiv);

    return this._scrollbarWidth;
};
Floater.prototype._escape = function (e) {
    if (
        e.key === "Escape" &&
        this === Floater.elements[Floater.elements.length - 1]
    ) {
        console.log(this._allowEscapeClose);
        this.close();
    }
};

// Build Modal Element
Floater.prototype._build = function () {
    const content = this._template.content.cloneNode(true);

    this._backdrop = document.createElement("div");
    this._backdrop.className = "floater__backdrop";

    const container = document.createElement("div");
    container.className = "floater__container";

    const modalContent = document.createElement("div");
    modalContent.className = "floater__content";

    if (this.opt.cssClass.length) {
        this.opt.cssClass.forEach((elem) => {
            if (typeof elem === "string") {
                container.classList.add(elem);
            }
        });
    }

    // Append content and elems
    modalContent.append(content);
    if (this._allowButtonClose) {
        // If we have close button
        const close = this._createButton("&times;", "floater__close", () => {
            this.close();
        });
        container.append(close);
    }
    container.append(modalContent);
    if (this.opt.footer) {
        this._modalFooter = document.createElement("div");
        this._modalFooter.className = "floater__footer";
        container.append(this._modalFooter);
        if (this._footerContent) {
            this._modalFooter.innerHTML = this._footerContent;
        }
        if (this._footerButtons.length) {
            this._footerButtons.forEach((button) => {
                this._modalFooter.append(button);
            });
        }
    }

    this._backdrop.append(container);
    document.body.append(this._backdrop);
};

// set Footer
Floater.prototype.setFooterContent = function (html) {
    this._footerContent = html;
    if (this._modalFooter) {
        this._modalFooter.innerHTML = html;
    }
};

// Set footer button
Floater.prototype.addFooterButton = function (
    title = "",
    buttonClass = "",
    callback
) {
    if (
        typeof title !== "string" ||
        typeof buttonClass !== "string" ||
        typeof callback !== "function"
    ) {
        console.error("Not right parameter(s)");
        return;
    }
    const button = this._createButton(title, buttonClass, callback);

    this._footerButtons.push(button);
    if (this._modalFooter) {
        this._footerButtons.forEach((button) => {
            this._modalFooter.append(button);
        });
    }
};
// Create Button
Floater.prototype._createButton = function (title, buttonClass, callback) {
    const button = document.createElement("button");
    button.className = buttonClass;
    button.innerHTML = title;
    button.onclick = callback;
    return button;
};

// Open Modal
Floater.prototype.open = function () {
    if (!document.body.contains(this._backdrop)) {
        this._build();
    }
    setTimeout(() => {
        this._backdrop.classList.add("floater--show");
    }, 10);

    // if we have overlay
    if (this._allowBackdropClose) {
        this._backdrop.onclick = (e) => {
            if (e.target === this._backdrop) {
                this.close();
            }
        };
    }

    // if we have escape
    if (this._allowEscapeClose) {
        document.addEventListener("keydown", this._escape);
    }

    document.body.classList.add("floater--no-scroll");
    document.body.style.paddingRight = this._getScrollbarWidth() + "px";

    // Callback when open modal
    if (typeof this.opt.onOpen === "function") this.opt.onOpen();

    Floater.elements.push(this);

    return this._backdrop;
};

// CLose Modal
Floater.prototype.close = function (destroy = this.opt.destroyOnClose) {
    Floater.elements.pop();
    console.log(this);
    this._backdrop.classList.remove("floater--show");
    if (!Floater.elements.length) {
        document.body.classList.remove("floater--no-scroll");
        document.body.style.paddingRight = "";
    }
    // Callback when close modal
    if (typeof this.opt.onClose === "function") this.opt.onClose();
    this._backdrop.ontransitionend = (e) => {
        if (e.propertyName !== "transform") return;
        if (destroy) {
            this._backdrop.remove();
        }
        document.removeEventListener("keydown", this._escape);
    };
};

Floater.prototype.destroy = function () {
    this.close(true);
};


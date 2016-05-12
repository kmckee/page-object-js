import * as selwd from "selenium-webdriver";
import {getBrowser} from "./index";

const by: typeof selwd.By = selwd.By;

export interface ILocator {
    find(): selwd.WebElement;
}

export class ClassNameLocator implements ILocator {
    private _className: string;

    constructor(value: string) {
        this._className = value;
    }

    public find(): selwd.WebElement {
        return getBrowser().findElement(by.className(this._className));
    }
}

export class CssLocator implements ILocator {
    private _css: string;

    constructor(value: string) {
        this._css = value;
    }

    public find(): selwd.WebElement {
        return getBrowser().findElement(by.css(this._css));
    }
}

export class IdLocator implements ILocator {
    private _id: string;

    constructor(value: string) {
        this._id = value;
    }

    public find(): selwd.WebElement {
        return getBrowser().findElement(by.id(this._id));
    }
}

export class JsLocator implements ILocator {
    private _js: string;

    constructor(value: string) {
        this._js = value;
    }

    public find(): selwd.WebElement {
        return getBrowser().findElement(by.js(this._js));
    }
}

export class LinkTextLocator implements ILocator {
    private _linkText: string;

    constructor(value: string) {
        this._linkText = value;
    }

    public find(): selwd.WebElement {
        return getBrowser().findElement(by.linkText(this._linkText));
    }
}

export class NameLocator implements ILocator {
    private _name: string;

    constructor(value: string) {
        this._name = value;
    }

    public find(): selwd.WebElement {
        return getBrowser().findElement(by.name(this._name));
    }
}

export class PartialLinkTextLocator implements ILocator {
    private _partialLinkText: string;

    constructor(value: string) {
        this._partialLinkText = value;
    }

    public find(): selwd.WebElement {
        return getBrowser().findElement(by.partialLinkText(this._partialLinkText));
    }
}

export class TagNameLocator implements ILocator {
    private _tagName: string;

    constructor(value: string) {
        this._tagName = value;
    }

    public find(): selwd.WebElement {
        return getBrowser().findElement(by.tagName(this._tagName));
    }
}

export class XpathLocator implements ILocator {
    private _xpath: string;

    constructor(value: string) {
        this._xpath = value;
    }

    public find(): selwd.WebElement {
        return getBrowser().findElement(by.xpath(this._xpath));
    }
}

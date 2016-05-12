import * as selwd from "selenium-webdriver";
import { ILocator } from "./locators";

export default class BaseElement {
    private _locator: ILocator;

    constructor(locator: ILocator) {
        this._locator = locator;
    }

    public click(): selwd.promise.Promise<void> {
        return this._locator.find().click();
    }

    get innerHtml(): selwd.promise.Promise<string> {
        return this._locator.find().getInnerHtml();
    }

    get outerHtml(): selwd.promise.Promise<string> {
        return this._locator.find().getOuterHtml();
    }

    get text(): selwd.promise.Promise<string> {
        return this._locator.find().getText();
    }
}

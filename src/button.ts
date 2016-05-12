import {getBrowser} from "./index";
import * as selwd from "selenium-webdriver";
import {ILocator} from "./locators";

export class Button {
    private _locator: ILocator;
    constructor(locator: ILocator) {
        this._locator = locator;
    }
    get visible(): selwd.promise.Promise<boolean> {
        return getBrowser().isElementPresent(this._locator.find());
    }
    get isEnabled(): selwd.promise.Promise<boolean> {
        return this._locator.find().isEnabled();
    }
}

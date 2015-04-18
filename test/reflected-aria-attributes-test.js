"use strict";

import jsdom from "jsdom";
import assert from "power-assert";
import ReflectedARIAAttributes from "../lib/reflected-aria-attributes"

var window = jsdom.jsdom().defaultView;
var document = window.document;

describe("ReflectedARIAAttributes.define()", () => {
    var button;

    beforeEach(done => {
        button = document.createElement("span");
        ReflectedARIAAttributes.define(button, ["aria-pressed"]);

        done();
    });

    it("should define reflected WAI-ARIA attributes to an element", () => {
        assert(button.ariaPressed !== undefined);
        assert(button.hasAttribute("aria-pressed"));
    });

    it("should define default value", () => {
        assert(button.ariaPressed === false);
        assert(button.getAttribute("aria-pressed") === "false");
    });

    it("property change should be reflected to attribute", () => {
        button.ariaPressed = true;

        assert(button.getAttribute("aria-pressed") === "true");
    });

    it("attribute change should be reflected to property", () => {
        button.setAttribute("aria-pressed", "true");
        assert(button.ariaPressed, true);
    });
});

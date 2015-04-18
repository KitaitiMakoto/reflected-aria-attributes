"use strict";

import jsdom from "jsdom";
import assert from "power-assert";
import ReflectedARIAAttributes from "../lib/reflected-aria-attributes"

var window = jsdom.jsdom().defaultView;
var document = window.document;

describe("ReflectedARIAAttributes.define()", () => {
    it("should define reflected WAI-ARIA attributes to an element", () => {
        var button = document.createElement("span");
        ReflectedARIAAttributes.define(button, ["aria-pressed"]);

        assert(button.ariaPressed !== undefined);
        assert(button.hasAttribute("aria-pressed"));
    });

    it("should define default value", () => {
        var button = document.createElement("span");
        ReflectedARIAAttributes.define(button, ["aria-pressed"]);

        assert(button.ariaPressed === false);
        assert(button.getAttribute("aria-pressed") === "false");
    });
});

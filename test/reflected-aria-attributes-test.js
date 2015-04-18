"use strict";

import jsdom from "jsdom";
import assert from "power-assert";
import ReflectedARIAAttributes from "../lib/reflected-aria-attributes"

var window = jsdom.jsdom().defaultView;
var document = window.document;

var shared = {
    shouldBehaveLikeReflectedAttribute: function(attr) {
        beforeEach(function(done) {
            ReflectedARIAAttributes.define(this.element, [attr]);
            done();
        });

        it("should define reflected WAI-ARIA attributes to an element", function() {
            assert(this.element.ariaPressed !== undefined);
            assert(this.element.hasAttribute("aria-pressed"));
        });

        it("should define default value", function() {
            assert(this.element.ariaPressed === false);
            assert(this.element.getAttribute("aria-pressed") === "false");
        });

        it("property change should be reflected to attribute", function() {
            this.element.ariaPressed = true;

            assert(this.element.getAttribute("aria-pressed") === "true");
        });

        it("attribute change should be reflected to property", function() {
            this.element.setAttribute("aria-pressed", "true");
            assert(this.element.ariaPressed, true);
        });
    }
};

describe("ReflectedARIAAttributes.define()", function() {
    beforeEach(function(done) {
        this.element = document.createElement("span");

        done();
    });

    for (let attr in ReflectedARIAAttributes.attributes) {
        shared.shouldBehaveLikeReflectedAttribute(attr);
    }

    it("should define multiple attributes at once", function() {
        var attrs = Object.keys(ReflectedARIAAttributes.attributes);
        ReflectedARIAAttributes.define(this.element, attrs);

        assert(this.element.hasAttribute("aria-pressed"));
        assert(this.element.hasAttribute("aria-disabled"));
    });
});

describe("ReflectedARIAAttributes.defineAll()", function() {
    beforeEach(function(done) {
        this.element = document.createElement("span");

        done();
    });

    it("should define all available properties", function() {
        ReflectedARIAAttributes.defineAll(this.element);

        var attrs = Object.keys(ReflectedARIAAttributes.attributes);
        attrs.forEach((attr) => {
            assert(this.element.hasAttribute(attr));
        });
    });
});

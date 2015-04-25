"use strict";

import jsdom from "jsdom";
import assert from "power-assert";
import ReflectedARIAAttributes from "../lib/reflected-aria-attributes";

var window = jsdom.jsdom().defaultView;
var document = window.document;
global.HTMLElement = window.HTMLElement

var shared = {
    shouldBehaveLikeReflectedAttribute: function(attr, prop) {
        beforeEach(function(done) {
            ReflectedARIAAttributes.attachAttributes(this.element, [attr]);

            done();
        });

        it("should attach reflected WAI-ARIA attributes to an element", function() {
            var propName = attr.replace(/-(\w)/g, (match, c) => c.toUpperCase());
            assert.strictEqual(this.element.hasAttribute(attr), false);

            if (attr === "aria-pressed") {
                var sampleValue = "false";
            } else {
                var valueType = ReflectedARIAAttributes.attributes[attr].value;
                var sampleValue = ReflectedARIAAttributes.attributeValueTypes[valueType].default;
            }
            this.element[propName] = sampleValue;
            assert.strictEqual(this.element.hasAttribute(attr), true);
            assert.strictEqual(this.element.getAttribute(attr), sampleValue);
        });

        it("property change should be reflected to attribute", function() {
            this.element[prop] = true;

            assert(this.element.getAttribute(attr) === "true");
        });

        it("attribute change should be reflected to property", function() {
            this.element.setAttribute(attr, "true");
            assert(this.element[prop] === true);
        });
    }
};

describe("ReflectedARIAAttributes.attachAttributes()", function() {
    beforeEach(function(done) {
        this.element = document.createElement("span");

        done();
    });

    for (let attr in ReflectedARIAAttributes.attributes) {
        var prop = ReflectedARIAAttributes.attributes[attr].propName;
        shared.shouldBehaveLikeReflectedAttribute(attr, prop);
    }

    it("should attach multiple attributes at once", function() {
        var attrs = Object.keys(ReflectedARIAAttributes.attributes);
        ReflectedARIAAttributes.attachAttributes(this.element, attrs);
        this.element.ariaPressed = true;
        this.element.ariaDisabled = true;

        assert(this.element.hasAttribute("aria-pressed"));
        assert(this.element.hasAttribute("aria-disabled"));
    });
});

describe("ReflectedARIAAttributes.attachRole()", function() {
    beforeEach(function() {
        this.element = document.createElement("div");
        ReflectedARIAAttributes.attachRole(this.element, "button");
    });

    it("should set role attribute", function() {
        assert.equal(this.element.getAttribute("role"), "button");
    });

    it("should add role if already some roles set", function() {
        ReflectedARIAAttributes.attachRole(this.element, "checkbox");
        assert.equal(this.element.getAttribute("role"), "button checkbox");
    });

    it("should reflect DOM attribute to property", function() {
        this.element.setAttribute("role", "main checkbox");
        var i = 0;
        var roles = ["main", "checkbox"];
        this.element.roleList.forEach(role => {
            assert.equal(role, roles[i]);
            i++;
        });
    });

    it("should attach role property", function() {
        this.element.roleList.add("main");
        assert.equal(this.element.role, "button main");
    });

    it("should make role property settable", function() {
        this.element.role = "main checkbox";
        assert.equal(this.element.roleList.item(0), "main");
        assert.equal(this.element.roleList.item(1), "checkbox");
    });

    it("should define attribute methods", function() {
        assert.strictEqual(this.element.ariaPressed, undefined);

        this.element.setAttribute("aria-pressed", "true");
        assert.strictEqual(this.element.ariaPressed, true);

        this.element.ariaPressed = false;
        assert.strictEqual(this.element.getAttribute("aria-pressed"), "false");
    });
});

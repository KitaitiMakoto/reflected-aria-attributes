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
            assert(this.element.ariaPressed !== undefined);
            assert(this.element.hasAttribute(attr));
        });

        it("should set default value", function() {
            assert(this.element.ariaPressed === false);
            assert(this.element.getAttribute(attr) === "false");
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

describe("ReflectedARIAAttributes.init()", function() {
    it("should be define all available properties to all elements", function() {
        ReflectedARIAAttributes.init();

        var a = document.createElement("a");
        a.ariaPressed = true;
        assert(a.hasAttribute("aria-pressed"));
        assert(a.ariaDisabled === false);
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
});

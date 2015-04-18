"use strict";

export default class ReflectedARIAAttributes {
    static define(element, attributes) {
        for (let attrName of attributes) {
            var desc = ReflectedARIAAttributes.attributes[attrName];
            if (! desc) {
                throw new Error(`Unknown attribute: {$attrName}`);
            }
            Object.defineProperty(element, desc.propName, {
                get: desc.getter,
                set: desc.setter
            });
            var isPrototype;
            try {
                isPrototype = !element.attributes;
            } catch(error) {
                isPrototype = true;
            }
            if (! isPrototype) {
                element.setAttribute(attrName, desc.default);
            }
        }
    }

    static defineAll(element) {
        var attrs = Object.keys(ReflectedARIAAttributes.attributes);
        ReflectedARIAAttributes.define(element, attrs);
    }

    static init() {
        ReflectedARIAAttributes.defineAll(HTMLElement.prototype);
    }
}
ReflectedARIAAttributes.attributes = {
    "aria-pressed": {
        propName: "ariaPressed",
        default: "false",
        getter: function() {
            return this.getAttribute("aria-pressed") === "true";
        },
        setter: function(value) {
            this.setAttribute("aria-pressed", !!value);
        }
    },
    "aria-disabled": {
        propName: "ariaDisabled",
        default: "false",
        getter: function() {
            return this.getAttribute("aria-disabled") === "true";
        },
        setter: function(value) {
            this.setAttribute("aria-disabled", !!value);
        }
    }
};

"use strict";

export default {
    attachAttributes(element, attributes) {
        for (let attrName of attributes) {
            var desc = this.attributes[attrName];
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
    },

    defineAll(element) {
        var attrs = Object.keys(this.attributes);
        this.attachAttributes(element, attrs);
    },

    init() {
        this.defineAll(HTMLElement.prototype);
    },

    attributes: {
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
    }
}

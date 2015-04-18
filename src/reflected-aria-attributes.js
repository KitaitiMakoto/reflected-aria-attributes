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
            element.setAttribute(attrName, desc.default);
        }
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
    }
};

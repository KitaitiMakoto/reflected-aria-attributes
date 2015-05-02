"use strict";

class TokenList {
    constructor(tokenAttributeValue, element, attribute) {
        this._list = new Set(TokenList._splitTokens(tokenAttributeValue));
        this._element = element;
	this._attribute = attribute;
        this._buildString();
    }

    toString() {
        return this._string;
    }

    add(token) {
        this._list.add(token);
        this._buildString();
    }

    contains(token) {
        return this._list.has(token);
    }

    remove(token) {
        this._list.delete(token);
        this._buildString();
    }

    update(tokenAttributeValue) {
        // TODO: Compare with difference performance between creating new and iterating over current items and roles
        this._list = new Set(TokenList._splitTokens(tokenAttributeValue));
        this._buildString();
    }

    forEach(callback, thisArg) {
        if (thisArg) {
            this._list.forEach(callback, thisArg);
        } else {
            this._list.forEach(callback);
        }
    }

    item(nth) {
        if (nth > this._list.size - 1) {
            return undefined;
        }
        var i = 0;
        for (let token of this._list.values()) {
            if (i === nth) {
                return token;
            }
            i++;
        }
    }

    _buildString() {
        var string = "";
        for (let token of this._list.values()) {
            if (string) {
                string += " ";
            }
            string += token;
        }
        this._string = string;
        this._element.setAttribute(this._attribute, this._string);
    }

    static _splitTokens(tokenString) {
        return tokenString ? tokenString.trim().split(/\s+/g) : [];
    }
}

var ReflectedARIAAttributes = {
    defineRoleListProperty(element) {
        var attr = element.getAttribute("role");
        var cache = {
            attr: attr,
            list: new TokenList(attr, element, "role")
        };
        Object.defineProperties(element, {
            "roleList": {
                enumerable: true,
                get: function() {
                    var attr = element.getAttribute("role");
                    if (cache.attr === attr) {
                        return cache.list;
                    }
                    cache.list.update(attr);
                    return cache.list;
                }
            },
            "role": {
                enumerable: true,
                get: function() {
                    return cache.list.toString();
                },
                set: function(value) {
                    cache.list.update(value);
                }
            }
        });
    },

    // TODO: Consider the case which element is a prototype
    // TODO: Prevent duplicate attachment
    attachRole(element, role) {
        if (typeof element.roleList === "undefined") {
            this.defineRoleListProperty(element);
        }
        var desc = this.roles[role];
        if (! desc) {
            return;
        }
        element.roleList.add(role);
        var mergedAttrs = [];
        while (desc) {
            mergedAttrs = mergedAttrs.concat(desc.attributes);
            desc = this.roles[desc.superclass];
        }
        this.attachAttributes(element, mergedAttrs);
    },

    attachAttributes(element, attributes) {
        for (let attrName of attributes) {
            var desc = this.attributes[attrName];
            if (! desc) {
                throw new Error(`Unknown attribute: ${attrName}`);
            }
            var propName = attrName.replace(/-(\w)/g, (str, c) => c.toUpperCase());
            if (element.hasOwnProperty(propName)) {
                continue;
            }
            var propDesc = this.attributeValueTypes[desc.value];
            if (propDesc.hasOwnProperty("default")) {
                var getter = propDesc.createGetter(attrName);
            } else {
                var getter = propDesc.createGetter(attrName, propDesc.default);
            }
            var setter = propDesc.createSetter(attrName);
            Object.defineProperty(element, propName, {
                get: getter,
                set: setter
            });
        }
    },

    roles: {
        "command": {
            attributes: [
                "aria-atomic",
                "aria-busy",
                "aria-controls",
                "aria-describedby",
                "aria-disabled",
                "aria-dropeffect",
                "aria-flowto",
                "aria-grabbed",
                "aria-haspopup",
                "aria-hidden",
                "aria-invalid",
                "aria-label",
                "aria-labelledby",
                "aria-live",
                "aria-owns",
                "aria-relevant"
            ]
        },
        "input": {
            superclass: "widget",
            attributes: [
                "aria-atomic",
                "aria-busy",
                "aria-controls",
                "aria-describedby",
                "aria-disabled",
                "aria-dropeffect",
                "aria-flowto",
                "aria-grabbed",
                "aria-haspopup",
                "aria-hidden",
                "aria-invalid",
                "aria-label",
                "aria-labelledby",
                "aria-live",
                "aria-owns",
                "aria-relevant"
            ]
        },
        "widget": {
            superclass: "roletype",
            attributes: [
                "aria-atomic",
                "aria-busy",
                "aria-controls",
                "aria-describedby",
                "aria-disabled",
                "aria-dropeffect",
                "aria-flowto",
                "aria-grabbed",
                "aria-haspopup",
                "aria-hidden",
                "aria-invalid",
                "aria-label",
                "aria-labelledby",
                "aria-live",
                "aria-owns",
                "aria-relevant"
            ]
        },
        "button": {
            superclass: "command",
            attributes: [
                "aria-expanded",
                "aria-pressed"
            ]
        },
        "checkbox": {
            superclass: "input",
            subclasses: ["menuitemcheckbox", "radio"],
            attributes: [
                "aria-checked"
            ]
        }
    },

    attributes: {
        "aria-atomic": {
            value: "true/false"
        },
        "aria-busy": {
            value: "true/false"
        },
        "aria-controls": {
            value: "ID reference list"
        },
        "aria-describedby": {
            value: "ID reference list"
        },
        "aria-disabled": {
            value: "true/false"
        },
        "aria-dropeffect": {
            value: "token list"
        },
        "aria-flowto": {
            value: "ID reference list"
        },
        "aria-grabbed": {
            value: "true/false/undefined"
        },
        "aria-haspopup": {
            value: "true/false"
        },
        "aria-hidden": {
            value: "true/false"
        },
        "aria-invalid": {
            value: "token"
        },
        "aria-label": {
            value: "string"
        },
        "aria-labelledby": {
            value: "ID reference list"
        },
        "aria-live": {
            value: "token",
            set: ["off", "polite", "assertive"],
            default: "off"
        },
        "aria-owns": {
            value: "ID reference list"
        },
        "aria-relevant": {
            value: "token list",
            set: ["additions", "removals", "text", "all", "additions text"],
            default: "additions text"
        },

        "aria-autocomplete": {
            value: "token",
            set: ["inline", "list", "both", "none"],
            defaut: "none"
        },
        "aria-checked": {
            value: "tristate",
            default: undefined
        },
        "aria-expanded": {
            value: "true/false/undefined"
        },
        "aria-level": {
            value: "integer"
        },
        "aria-multiline": {
            value: "true/false"
        },
        "aria-multiselectable": {
            value: "true/false"
        },
        "aria-orientation": {
            value: "token",
            set: ["vertical", "horizontal"],
            default: "horizontal"
        },
        "aria-pressed": {
            value: "tristate",
            default: undefined
        },
        "aria-readonly": {
            value: "true/false"
        },
        "aria-required": {
            value: "true/false"
        },
        "aria-selected": {
            value: "true/false/undefined"
        },
        "aria-sort": {
            value: "token",
            set: ["ascending", "descending", "none", "other"],
            default: "none"
        },
        "aria-valuemax": {
            value: "number"
        },
        "aria-valuemin": {
            value: "number"
        },
        "aria-valuenow": {
            value: "number"
        },
        "aria-valuetext": {
            value: "string"
        },

        "aria-activedescendant": {
            value: "ID reference"
        },
        "aria-posinset": {
            value: "integer"
        },
        "aria-setsize": {
            value: "integer"
        }
    },

    attributeValueTypes: {
        "true/false": {
            createGetter: (attrName, defaultValue) => {
                defaultValue = defaultValue || ReflectedARIAAttributes.attributeValueTypes["true/false"].default;
                return function trueFalseGetter() {
                    if (this.hasAttribute(attrName)) {
                        return this.getAttribute(attrName) === "true";
                    }
                    return defaultValue;
                };
            },
            createSetter: (attrName) => {
                return function trueFalseSetter(value) {
                    this.setAttribute(attrName, value);
                };
            },
            default: false
        },
        "tristate": {
            createGetter: (attrName, defaultValue) => {
                if (arguments.length === 1) {
                    // defaultValue might be specified as undefined explicity.
                    // To distinguish explicitly specified undefined from non-specified defaultValue variable,
                    // need to check arguments.length
                    defaultValue = ReflectedARIAAttributes.attributeValueTypes["tristate"].default;
                }
                return function tristateGetter() {
                    if (this.hasAttribute(attrName)) {
                        return this.getAttribute(attrName) === "true";
                    }
                    return defaultValue;
                };
            },
            createSetter: (attrName, defaultValue) => {
                return function setTristate(value) {
                    if (value === undefined) {
                        this.removeAttribute(attrName);
                    } else if (value === "mixed") {
                        this.setAttribute(attrName, "mixed");
                    } else {
                        this.setAttribute(attrName, value);
                    }
                };
            },
            default: false
        },
        "true/false/undefined": {
            createGetter: (attrName, defaultValue) => {
                return function getTrueFalseUndefinedGetter() {
                    if (this.hasAttribute(attrName)) {
                        var value;
                        switch(this.getAttribute(attrName)) {
                        case "true":
                            value = true;
                            break;
                        case "false":
                            value = false;
                            break;
                        case "undefined":
                            value = undefined;
                            break;
                        default:
                            value = defaultValue;
                            break;
                        }
                        return value;
                    }
                    return defaultValue;
                };
            },
            createSetter: (attrName) => {
                return function setTrueFalseUndefinedSetter(value) {
                    this.setAttribute(attrName, String(value));
                };
            },
            default: "undefined"
        },
        "ID reference": {
            createGetter: (attrName, defaultValue) => {
                defaultValue = defaultValue || ReflectedARIAAttributes.attributeValueTypes["ID reference"].default;
                return function() {
                    return this.getAttribute(attrName) || defaultValue;
                };
            },
            createSetter: (attrName) => {
                return function(value) {
                    this.setAttribute(attrName, value);
                };
            },
            default: ""
        },
        "ID reference list": {
            createGetter: (attrName, defaultValue) => {
                return function() {
                    
                };
            },
            createSetter: (attrName) => {
                return function(value) {
                    
                };
            }
        },
        "integer": {
            createGetter: (attrName, defaultValue) => {
                return function() {
                    
                };
            },
            createSetter: (attrName) => {
                return function(value) {
                    
                };
            }
        },
        "number": {
            createGetter: (attrName, defaultValue) => {
                return function() {
                    
                };
            },
            createSetter: (attrName) => {
                return function(value) {
                    
                };
            }
        },
        "string": {
            createGetter: (attrName, defaultValue) => {
                return function() {
                    
                };
            },
            createSetter: (attrName) => {
                return function(value) {
                    
                };
            }
        },
        "token": {
            createGetter: (attrName, defaultValue) => {
                return function() {
                    
                };
            },
            createSetter: (attrName) => {
                return function(value) {
                    
                };
            }
        },
        "token list": {
            createGetter: (attrName, defaultValue) => {
                return function() {
                    
                };
            },
            createSetter: (attrName) => {
                return function(value) {
                    
                };
            }
        }
    }
}

export default ReflectedARIAAttributes;

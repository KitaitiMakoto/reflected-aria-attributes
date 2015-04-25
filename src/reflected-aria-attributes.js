"use strict";

class RoleList {
    constructor(roleAttributeValue, element) {
        this._list = new Set(RoleList._splitRoles(roleAttributeValue));
        this._element = element;
        this._buildString();
    }

    toString() {
        return this._string;
    }

    add(role) {
        this._list.add(role);
        this._buildString();
    }

    contains(role) {
        return this._list.has(role);
    }

    remove(role) {
        this._list.delete(role);
        this._buildString();
    }

    update(roleAttributeValue) {
        // TODO: Compare with difference performance between creating new and iterating over current items and roles
        this._list = new Set(RoleList._splitRoles(roleAttributeValue));
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
        for (let role of this._list.values()) {
            if (i === nth) {
                return role;
            }
            i++;
        }
    }

    _buildString() {
        var string = "";
        for (let role of this._list.values()) {
            if (string) {
                string += " ";
            }
            string += role;
        }
        this._string = string;
        this._element.setAttribute("role", this._string);
    }

    static _splitRoles(roleString) {
        return roleString ? roleString.trim().split(/\s+/g) : [];
    }
}

var ReflectedARIAAttributes = {
    defineRoleListProperty(element) {
        var attr = element.getAttribute("role");
        var cache = {
            attr: attr,
            list: new RoleList(attr, element)
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
    attachRole(element, role) {
        if (typeof element.roleList === "undefined") {
            this.defineRoleListProperty(element);
        }
        var desc = this.roles[role];
        if (! desc) {
            return;
        }
        element.roleList.add(role);
        element.setAttribute("role", element.roleList);
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

    roles: {
        command: {
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
        input: {
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
        button: {
            superclass: "command",
            attributes: ["aria-expanded", "aria-pressed"]// add info that pressed value type is tristate or so on
        },
        checkbox: {
            superclass: "input",
            subclasses: ["menuitemcheckbox", "radio"],
            attributes: ["aria-checked"]
        }
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

export default ReflectedARIAAttributes;

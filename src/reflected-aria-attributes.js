"use strict";

class RoleList {
    constructor(roles, element) {
        this._list = new Set(roles);
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

    has(role) {
        return this._list.has(role);
    }

    delete(role) {
        this._list.delete(role);
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
}

export default {
    defineRoleListProperty(element) {
        var attr = element.getAttribute("role");
        var cache = {
            attr: attr,
            list: new RoleList(attr ? attr.split(/\s+/g) : [], element)
        };
        Object.defineProperty(element, "roleList", {
            enumerable: true,
            get: function() {
                var attr = element.getAttribute("role");
                if (cache.attr === attr) {
                    return cache.list;
                }
                // TODO: Compare performance with one of iterating over set entries
                cache.list = new RoleList(attr ? attr.split(/\s+/g) : [], this);
                return cache.list;
            }
        });
    },

    attachRole(element, role) {
        if (typeof element.roleList === "undefined") {
            this.defineRoleListProperty(element);
        }
        element.roleList.add(role);
        element.setAttribute("role", element.roleList);
    },

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

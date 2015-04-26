Reflected ARIA Attributes
=========================

Installation
------------

    $ npm install reflected-aria-attributes

Usage
-----

Defining ARIA attribute:

```javascript
import aria from "reflected-aria-attributes";

var a = document.createElement("a");
aria.define(a, "aria-pressed");
a.ariaPressed; // => undefined
a.ariaPressed = true;
a.getAttribute("aria-pressed"); // => "true"

a.ariaDisabled; // => undefined
a.ariaDisabled = true;
a.hasAttribute("aria-disabled"); // => false
```

Attaching role to elements:

```javascript
import aria from "reflected-aria-attributes";

var a = document.createElement("a");
aria.attachRole(a, "button");
a.ariaDisabled = true;
a.hasAttribute("aria-disabled"); // => true
a.getAttribute("aria-disabled"); // => "true"
```

Using in ECMAScript 5:

```javascript
aria = require("reflected-aria-attributes/old-lib/reflected-aria-attributes");

a = document.createElement("a");
aria.attachRole(a, "button");

a.ariaDisabled = true;
a.hasAttribute("aria-disabled"); // => true
a.getAttribute("aria-disabled"); // => "true"
```

State
-----

Still work in progress and too unstable.

Currently supported attribute types:

* true/false
* tristate

Currently supported roles:

* button(partially)

See also
--------

* [Accessible Rich Internet Applications (WAI-ARIA) 1.0](http://www.w3.org/TR/wai-aria/)
* [[Bug 27295] New: role and aria-* content attributes should be reflected DOM attributes](https://lists.w3.org/Archives/Public/public-html-admin/2014Nov/0032.html)
* [DOM APIs to expose (accessible) role,states, properties](http://discourse.specifiction.org/t/dom-apis-to-expose-accessible-role-states-properties/693)

License
-------

GPLv3 or later. See LICENSE file for details.

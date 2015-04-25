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
a.ariaPressed; // => false
a.ariaPressed = true;
a.getAttribute("aria-pressed"); // => "true"

a.ariaDisabled; // => undefined
a.ariaDisabled = true;
a.hasAttribute("aria-disabled"); // => false
```

State
-----

Still work in progress and too unstable.

Currently supported attributes:

* `aria-pressed`
* `aria-disabled`

See also
--------

* [Accessible Rich Internet Applications (WAI-ARIA) 1.0](http://www.w3.org/TR/wai-aria/)
* [[Bug 27295] New: role and aria-* content attributes should be reflected DOM attributes](https://lists.w3.org/Archives/Public/public-html-admin/2014Nov/0032.html)
* [DOM APIs to expose (accessible) role,states, properties](http://discourse.specifiction.org/t/dom-apis-to-expose-accessible-role-states-properties/693)

License
-------

GPLv3 or later. See LICENSE file for details.

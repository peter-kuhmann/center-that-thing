<p align="center">
    <a href="https://center-that-thing.vercel.app/"><img src="assets/logo.png" width="500"></a>
</p>

# ➡️ Center. That. Thing! ⬅️

Centers any HTML element horizontally – **relative to the screen!**

Try out the demo: [Show. Me. THE. DEMO!!! 🔗](https://center-that-thing.vercel.app/)
Check out also the CSS comparison demo: [CSS vs. CTT Comparison](https://center-that-thing.vercel.app/css-comparison.html)

Who is this favor?

- For you my, dear **designers**! ❤️ Tell your developer colleagues to use this library.
- For you, my dear **developer colleagues**. ❤️ Don't be afraid to implement this annoying centered thing anymore. Just
  use this library.

⬇️ Check out this lovely GIF:

<img src="assets/meme.gif" alt="A meme GIF about a harsh discussion between a designer and a developer about centering elements." width="600">

# 📖 Table of contents

<!-- TOC -->
* [➡️ Center. That. Thing! ⬅️](#-center-that-thing-)
* [📖 Table of contents](#-table-of-contents)
* [🧑‍💻 Usage](#-usage)
  * [Add the script](#add-the-script)
  * [Center using JS](#center-using-js)
  * [Center with CTT using HTML attributes](#center-with-ctt-using-html-attributes)
  * [Center with CTT using CSS variables (yes!)](#center-with-ctt-using-css-variables-yes)
  * [Dynamic elements](#dynamic-elements)
* [🛠️ Options](#-options)
* [🛟 The problem](#-the-problem)
* [💡 How it works](#-how-it-works)
* [💥 Collision detection](#-collision-detection)
* [😖 Can't I just use modern CSS?](#-cant-i-just-use-modern-css)
* [⛔️ Issues](#-issues)
* [✍️ Author](#-author)
<!-- TOC -->

# 🧑‍💻 Usage
Assumptions:

- You are able to add a JavaScript library to your website's/project's `<head>`.
- You can add IDs or classes to elements respectively extract element IDs.
- You can do **at least one** of the following:
    - Execute some JavaScript at the end of your page.
    - Add custom HTML attribute to HTML elements.
    - Adjust the global CSS.

## Add the script

Add the following script to one or every page:

```html
<script src="https://cdn.jsdelivr.net/gh/peter-kuhmann/center-that-thing@1.0.2/dist/center-that-thing.min.js"></script>
```

## Center using JS

To center a specific element by executing some JavaScript, use:

```javascript
// Use element reference
centerThatThing(myElementToCenter, { /* options */})

// Use CSS selector
centerThatThing("nav > .logo", { /* options */})
```

**The `<script>` block must come ofter the element!**

## Center with CTT using HTML attributes

Add the attribute `data-ctt-enable="true"` to the element you want to center.

```html

<div class="container">
    <div>Left</div>
    <div data-ctt-enable="true">To be centered</div>
    <div>Right</div>
</div>
```

## Center with CTT using CSS variables (yes!)

Add a CSS variable to your global CSS:

```css
/* You must add it to ":root"! */
:root {
    --center-that-thing: '[{"selector": "nav > .logo"}, {"selector": "footer > .logo", "collisionDetection": "siblings"}]';
}
```

## Dynamic elements

If you want the library to center elements that will be
dynamically added to your page but have e.g. the HTML attribute `data-ctt-enable="true"`,
then execute the following function:

```javascript
enableCenterThatThingDynamicDiscovery()
```

# 🛠️ Options

The library currently supports the following options:

| Option               | Mandatory | Type              | Options             | Description                                                                                                          | HTML attribute                           |
|----------------------|-----------|-------------------|---------------------|----------------------------------------------------------------------------------------------------------------------|------------------------------------------|
| `collisionDetection` | NO        | `false OR string` | `false, "siblings"` | `false` turns collision detection of. `"siblings"` causes the library to only move the element between the siblings. | `data-ctt-collision-detection="{value}"` |

# 🛟 The problem
The following images describe a problem scenario with flex:

![Imagine you have a flex row container](assets/problem-step-1.png)
![You add three elements. One very small, one very big, and one medium large one.](assets/problem-step-2.png)
![Now you apply the flex setting "justify-content: space-between".](assets/problem-step-3.png)
![You expect the element in the middle to be centered. But that's not the case, as the siblings are of different size.](assets/problem-step-4.png)

What you want to achieve is: **Position one element exactly in the center of the screen.**

This is just one very simple problem example. There are others out there (container has an offset).

This library helps you to position that one element exactly in the center of the screen.

# 💡 How it works

Let's make it short:

- The library remembers your element.
- The library gets the current position.
- The library computes the ideal position (centered in the middle of the screen).
- The library applies an offset using `position: relative;` and `left: {offset}px;`

The library does that again, when

- the screen size changes or
- the element size changes.

The library currently also supports a simple collision detection.

# 💥 Collision detection

You may not want the element to be centered relative to the screen at any cost.

You may not want the element to cover other elements (e.g. in the navigation).

Therefor, the library supports also a "collision detection" mechanism.
Currently, it supports:

- no collision detection (`false`)
- siblings/neighbour checks (`"siblings"`)

**Check out the demo, to understand better!**

# 😖 Can't I just use modern CSS?
Yes, you can. In many cases. **But in some, not.**

**There are generally two CSS solutions:**
- Flex layout with the sibling elements using `flex: 1;` to we of equal width. This causes the center element to be sandwiched exactly in the middle.
- Grid layout with `grid-template-columns: 1fr auto 1fr;`. Same principle as with the flex layout: Center element will be sandwiched.

**When does that work?**
1. The container is centered.
2. You have three (or an odd number) of elements.
3. It's okay for you, if both siblings are of equal width.

**When is this not a good idea?**
- You want the sibling elements to have different widths that use available space and the centered element should move.
- You have two elements respectively an even number of elements.
- The container is NOT centered.

Check out the CSS vs. CTT comparison: [CSS vs. CTT Comparison](https://center-that-thing.vercel.app/css-comparison.html)

# ⛔️ Issues

Do you have an issue with that library?

➡️ Please create a GitHub issue! 🙏

# ✍️ Author

Peter Kuhmann<br/>
Senior Software Engineer<br/>
[info@peter-kuhmann.de](mailto:info@peter-kuhmann.de)<br/>
[https://www.peter-kuhmann.de](https://www.peter-kuhmann.de)

<a href="https://www.peter-kuhmann.de"><img src="assets/peter-kuhmann-logo.png" alt="Peter Kuhmann Logo" width="300"></a>


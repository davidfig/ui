## ??? ui
UI and Windows library build on pixi.js

## rationale
Exposing the UI library I built for use with my pixel editor.

## Live Demo
https://davidfig.github.io/ui/

## Installation

TBD

## Simple Usage

TBD

## API
### src/button.js
```js
    /**
     * @param {object} [options]
     * @param {string} [options.text]
     * @param {PIXI.TextStyle} [options.textStyle]
     * @param {string=center} [options.align] combination of left/right/center and top/bottom/center or center (e.g., 'center-bottom')
     * @param {texture} [options.sprite]
     * @param {boolean} [options.fit=true]
     */
    constructor(options)
```
### src/dialog.js
```js
    /**
     * @param {object} options
     * @param {string} [options.text]
     * @param {string} [options.buttons]
     * @param {boolean} [options.draggable=true]
     * @param {number} [options.wrap=window.innerWidth/2]
     */
    constructor(text, options)
```
### src/edit-text.js
```js
    /**
     *
     * @param {string} text
     * @param {object} [options]
     * @param {string} [options.align=left] (middle or center, left, right) horizontal align
     * @param {string} [options.edit] (number, hex) type of characters allowed
     * @param {number} [options.min] minimum number of type is number
     * @param {number} [options.max] maximum number of type is number
     * @param {number} [options.count] number of characters to show
     * @param {number} [options.maxCount] maximum number of characters for editing
     * @param {object} [options.theme]
     * @param {string} [options.beforeText] add text before edit box
     * @param {string} [options.afterText] add text after edit box
     * @param {boolean} [options.fit=true]
     */
    constructor(text, options)
```
### src/scroll.js
```js
    /**
     * @param {object} [options]
     */
    constructor(options)
```
### src/tree.js
```js
    /**
     * @param {object} [options]
     */
    constructor(options)
```
### src/ui.js
```js
    /**
     * @param {object} [options]
     * @param {object} [options.theme]
     */
    constructor(options)
```
### src/window.js
```js
    /**
     * @param {object} options
     * @param {number} [options.width]
     * @param {number} [options.height]
     * @param {boolean} [options.fullscreen]
     * @param {boolean} [options.draggable]
     * @param {boolean} [options.resizeable]
     * @param {boolean} [options.clickable]
     * @param {number} [options.fit]
     * @param {object} [options.theme]
     */
    constructor(options)
```
## License 
MIT License  
(c) 2017 [YOPEY YOPEY LLC](https://yopeyopey.com/) by [David Figatner](https://twitter.com/yopey_yopey/)

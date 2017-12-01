WIP

## yy-ui
UI and Windows library build on pixi.js

## rationale
Exposing the UI library I built for use with my pixel editor.

## Live Demo
https://davidfig.github.io/ui/

## Installation

npm i yy-ui

## API
### src/list.js
```js
    /**
     * @param {object} [options]
     * @param {boolean} [options.many] select many
     * @emit select (item, List)
     * @emit unselect (item, List)
     */
    constructor(options)

```
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
### src/spacer.js
```js
    /**
     * @param {number} width
     * @param {number} height
     * @param {object} [options]
     */
    constructor(width, height, options)

```
### src/stack.js
```js
    /**
     * @param {Array} [items] items to add
     * @param {object} [options]
     * @param {boolean} [options.horizontal] horizontal instead of vertical
     * @param {boolean} [options.sameWidth]
     * @param {boolean} [options.sameHeight]
     * @param {string} [options.justify=center] left or right (justify in the non-stacked direction)
     */
    constructor(items, options)

```
### src/text.js
```js
    /**
     * @param {string} text
     * @param {object} [options]
     * @param {PIXI.TextStyle} [options.textStyle]
     */
    constructor(text, options)

```
### src/tree.js
```js
    /**
     * @param {object} [options]
     * @param {boolean} [options.entryMove]
     * @param {boolean} [options.noFolderSelection]
     * @param {boolean} [options.noEntrySelection]
     * @emit select (item, List)
     * @emit unselect (item, List)
     */
    constructor(options)

    /**
     *
     * @param {object} [parent]
     * @param {object} [options]
     * @param {string} [options.name]
     * @param {string} [options.noLayout]
     * @param {number} [options.index]
     */
    addFolder(parent, options)

    /**
     *
     * @param {object} [parent]
     * @param {object} [options]
     * @param {string} [options.name]
     * @param {string} [options.noLayout]
     * @param {number} [options.index]
     */
    addEntry(parent, options)

```
### src/ui.js
```js
    /**
     * @param {object} [options]
     * @param {object} [options.theme]
     * @param {object} [options.div]
     * @param {(number|string)} [options.background=transparent] fill in the background with this color
     * @param {number} [options.width=window.innerWidth] width of UI
     * @param {number} [options.height = window.innerHeight] height of UI
     * @param {boolean} [options.preventDefault=true] prevent default on input events
     * @param {boolean} [options.chromeDebug=true] allow ctrl-r to refresh page and ctrl-shift-i to open debug window
     */
    constructor(options)

    /**
     *
     * @param {number} [width=window.innerWidth] of the screen
     * @param {number} [height=window.innerHeight
     */
    resize(width, height)

    /**
     *
     * @param {string} type
     * @param {function} callback
     * @param {object} context
     */
    addListener(type, callback)

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
     * @param {number} [options.fitX]
     * @param {number} [options.fitY]
     * @param {boolean} [options.noOversizeX] don't allow horizontal resizing beyond the size of the content
     * @param {boolean} [options.noOversizeY] don't allow vertical resizing beyond the size of the content
     * @param {boolean|string} [options.overflow=false] true, x, or y
     * @param {object} [options.theme]
     * @param {string} [options.place] combination of top/center/bottom and left/center/bottom
     * @param {number} [options.maxHeight]
     * @param {number} [options.maxWidth]
     * @param {boolean} [options.modal]
     */
    constructor(options)

```
## License 
MIT License  
(c) 2017 [YOPEY YOPEY LLC](https://yopeyopey.com/) by [David Figatner](https://twitter.com/yopey_yopey/)

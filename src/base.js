const PIXI = require('pixi.js')
const exists = require('exists')
const pointInTriangle = require('point-in-triangle')
const Viewport = require('../../../components/pixi-viewport/')

const THEME = require('./theme.json')

module.exports = class Window extends PIXI.Container
{
    /**
     * @param {object} options
     * @param {number} [options.width]
     * @param {number} [options.height]
     * @param {boolean} [options.fullscreen]
     * @param {boolean} [options.draggable]
     * @param {boolean} [options.resizeable]
     * @param {boolean} [options.clickable]
     * @param {number} [options.fit]
     * @param {boolean|string} [options.overflow] true, x, or y
     * @param {object} [options.theme]
     */
    constructor(options)
    {
        super()
        this.types = ['Window']
        options = options || {}
        this.windowShadowGraphics = super.addChild(new PIXI.Graphics())
        this.windowGraphics = super.addChild(new PIXI.Graphics())
        this.scrollGraphics = super.addChild(new PIXI.Graphics())
        this.resizeGraphics = super.addChild(new PIXI.Graphics())
        this.contentContainer = super.addChild(new PIXI.Container())
        const mask = this.contentContainer.addChild(new PIXI.Graphics())
        this.contentContainer.mask = mask
        this.content = this.contentContainer.addChild(new PIXI.Container())
        this.resizeable = options.resizeable
        this.clickable = options.clickable
        this.theme = options.theme || {}
        this.cursor = options.cursor
        this.draggable = options.draggable
        this.noFitX = exists(options.width)
        this._windowWidth = options.width || this.get('minimum-width')
        this.noFitY = exists(options.height)
        this._windowHeight = options.height || this.get('minimum-height')
        this.fit = options.fit
        this.overflow = options.overflow
        this.drawWindowShape()
    }

    getTheme()
    {
        let parent = this.parent
        while (parent && parent.type !== 'UI')
        {
            parent = parent.parent
        }
        if (parent)
        {
            return parent.theme
        }
    }

    get(name)
    {
        let result = exists(this.theme[name]) ? this.theme[name] : this._get(name)
        if (name.indexOf('color') !== -1)
        {
            result = isNaN(result) ? parseInt(result.substring(1), 16) : result
        }
        return result
    }

    _get(name)
    {
        if (exists(this[name]))
        {
            return this[name]
        }
        const theme = this.getTheme()
        for (let i = this.types.length - 1; i >= 0; i--)
        {
            const current = this.types[i]
            if (theme && exists(theme[current][name]))
            {
                return theme[current][name]
            }
            else if (exists(THEME[current][name]))
            {
                return THEME[current][name]
            }
        }
    }

    get overflow()
    {
        return this._overflow
    }
    set overflow(value)
    {
        this._overflow = value
        if (this._overflow)
        {
            const x = this._overflow === 'x' || this._overflow === true
            const y = this._overflow === 'y' || this._overflow === true
            if (!this.viewport)
            {
                this.viewport = new Viewport(this.content, { screenWidth: this._windowWidth, screenHeight: this._windowHeight, worldWidth: this.content.width, worldHeight: this.content.height, noListeners: true })
            }
            this.viewport
                .drag()
                .decelerate()
            const time = 150
            if (x & y)
            {
                this.viewport
                    .bounce({ time, underflow: 'left' })
            }
            else if (x)
            {
                this.viewport
                    .clamp({ direction: 'y', underflow: 'left' })
                    .bounce({ time, sides: 'horizontal', underflow: 'left'})
            }
            else if (y)
            {
                this.viewport
                    .clamp({ direction: 'x', underflow: 'left' })
                    .bounce({ time, sides: 'vertical', underflow: 'left' })
            }
        }
    }

    set width(value)
    {
        this._windowWidth = value
        this.noFitX = exists(value) ? true : false
        this.layout()
        this.drawWindowShape()
    }
    get width()
    {
        return this._windowWidth
    }

    get center()
    {
        const spacing = this.get('spacing') * 2
        return { x: (this._windowWidth - spacing) / 2, y: (this._windowHeight - spacing) / 2}
    }

    get left() { return 0 }
    get top() { return 0 }
    get right() { return this._windowWidth - this.get('spacing') * 2 }
    get bottom() { return this._windowHeight - this.get('spacing') * 2 }

    set height(value)
    {
        this._windowHeight = value
        this.noFitY = exists(value) ? true : false
        this.layout()
        this.drawWindowShape()
    }
    get height()
    {
        return this._windowHeight
    }

    drawWindowShape()
    {
        this.windowShadowGraphics
            .clear()
            .beginFill(0, this.get('shadow-alpha'))
            .drawRoundedRect(0, 0, this._windowWidth, this._windowHeight, this.get('corners'))
            .endFill()
        const shadow = this.get('shadow-size')
        this.windowGraphics
            .clear()
            .beginFill(this.get('background-color'))
            .drawRoundedRect(shadow, shadow, this._windowWidth - shadow * 2, this._windowHeight - shadow * 2, this.get('corners'))
            .endFill()
        if (this.resizeable)
        {
            const size = this.get('resize-border-size')
            this.resizeGraphics
                .beginFill(this.get('resize-border-color'))
                .moveTo(this._windowWidth, this._windowHeight - size)
                .lineTo(this._windowWidth, this._windowHeight)
                .lineTo(this._windowWidth - size, this._windowHeight)
                .endFill()
        }
        const spacing = this.get('spacing')
        this.contentContainer.mask
            .clear()
            .beginFill(0xffffff)
            .drawRect(0, 0, this._windowWidth - spacing * 2, this._windowHeight - spacing * 2)
            .endFill()
        this.contentContainer.position.set(spacing, spacing)
        if (this.overflow)
        {
            this.drawOverflow()
        }
        this.dirty = true
    }

    drawOverflow()
    {
        const spacing = this.get('spacing')
        const scrollSpace = this.get('scrollbar-spacing')
        if (this.overflow !== 'x')
        {
            const innerHeight = this._windowHeight - spacing * 2
            let start = (this.content.y / this.content.height) * -this.bottom
            const height = (this.viewport.worldScreenHeight / this.content.height) * innerHeight
            start = start < 0 ? 0 : start
            start = start > innerHeight - height ? innerHeight - height : start
            this.scrollGraphics
                .clear()
                .beginFill(this.get('scrollbar-background-color'))
                .drawRect(this._windowWidth - spacing + scrollSpace, spacing, spacing - scrollSpace * 2, innerHeight)
                .endFill()
                .beginFill(this.get('scrollbar-foreground-color'))
                .drawRect(this._windowWidth - spacing + scrollSpace, spacing + start, spacing - scrollSpace * 2, height)
                .endFill()
        }
    }

    down(x, y, data)
    {
        const point = { x, y }
        if (this.resizeable)
        {
            const size = this.get('resize-border-size')
            const local = super.toLocal(point)
            if (pointInTriangle([local.x, local.y], [[this._windowWidth, this._windowHeight - size], [this._windowWidth, this.y + this._windowHeight], [this._windowWidth - size, this._windowHeight]]))
            {
                this.isDown = { x: point.x, y: point.y }
                this.resizing = { width: this._windowWidth, height: this._windowHeight }
                this.parent.addChild(this)
                return true
            }
        }

        if (this.viewport)
        {
            const spacing = this.get('spacing')
            if (point.x >= this.x + spacing && point.y >= this.y + spacing && point.x <= this.x + this.width - spacing * 2 && point.y <= this.y + this.height - spacing * 2)
            {
                if (this.viewport.down(x, y, data))
                {
                    return true
                }
            }
        }

        if (this.draggable)
        {
            this.isDown = { x: this.x - point.x, y: this.y - point.y }
            this.parent.addChild(this)
            return true
        }

        this.parent.addChild(this)
    }

    move(x, y, data)
    {
        if (this.oldCursor !== null)
        {
            this.cursor = this.oldCursor
            this.oldCursor = null
        }
        if (this.cursor)
        {
            document.body.style.cursor = this.cursor
        }
        if (this.resizing && this.isDown)
        {
            const minWidth = this.get('minimum-width')
            const minHeight = this.get('minimum-height')
            this._windowWidth = this.resizing.width + x - this.isDown.x
            this._windowWidth = this._windowWidth < minWidth ? minWidth : this._windowWidth
            this._windowHeight = this.resizing.height + y - this.isDown.y
            this._windowHeight = this._windowHeight < minHeight ? minHeight : this._windowHeight
            this.layout()
            this.emit('resizing', this)
            return true
        }
        else if (this.draggable && this.isDown)
        {
            this.x = x + this.isDown.x
            this.y = y + this.isDown.y
            this.dirty = true
            return true
        }
        else if (this.viewport && this.viewport.move(x, y, data))
        {
            this.dirty = true
            return true
        }
        else if (this.draggable)
        {
            const point = { x, y }
            const size = this.get('resize-border-size')
            const local = super.toLocal(point)
            if (pointInTriangle([local.x, local.y], [[this._windowWidth, this._windowHeight - size], [this._windowWidth, this.y + this._windowHeight], [this._windowWidth - size, this._windowHeight]]))
            {
                this.oldCursor = this.cursor
                this.cursor = 'se-resize'
            }
        }
    }

    up(x, y, data)
    {
        if (this.viewport)
        {
            this.viewport.up(x, y, data)
        }
        if (this.resizing)
        {
            this.resizing = false
            this.isDown = false
            this.emit('resize-end')
            return true
        }
        if (this.draggable && this.isDown)
        {
            this.isDown = false
            this.emit('drag-end')
            return true
        }
    }

    getSize()
    {
        const child = this.content
        const sizes = this._wbs
        let x, y
        if (child.anchor)
        {
            x = child.x + child.x * child.anchor.x
            y = child.y + child.y * child.anchor.y
        }
        else
        {
            x = child.x
            y = child.y
        }
        const width = child.width
        const height = child.height
        sizes.x = (x + width > sizes.x) ? x + width : sizes.x
        sizes.y = (y + height > sizes.y) ? y + height : sizes.y
    }

    layout()
    {
        if (this.fit)
        {
            const spacing = this.get('spacing')
            this._wbs = { x: 0, y: 0 }
            this.getSize()
            if (!this.noFitX)
            {
                this._windowWidth = this._wbs.x + spacing
            }
            if (!this.noFitY)
            {
                this._windowHeight = this._wbs.y + spacing
            }
        }
        this.drawWindowShape()
        if (this.viewport)
        {
            this.viewport.resize(this._windowWidth, this._windowHeight, this.content.width, this.content.height)
        }
    }

    fontStyle()
    {
        const style = {}
        style.fontFamily = this.get('font-family')
        style.fontSize = this.get('font-size')
        style.fill = this.get('foreground-color')
        return style
    }

    centerToParent()
    {
        this.position.set(this.parent.width / 2 - this.width / 2, this.parent.height / 2 - this.height / 2)
    }

    centerToDesktop()
    {
        this.position.set(window.innerWidth / 2 - this.width / 2, window.innerHeight / 2 - this.height / 2)
    }

    update(elapsed)
    {
        if (this.viewport)
        {
            this.viewport.update(elapsed)
            if (this.viewport.dirty)
            {
                this.drawOverflow()
                this.dirty = true
                this.viewport.dirty = false
            }
        }
    }

    keydown()
    {
    }

    keyup()
    {
    }

    addChild() { return this.content.addChild(...arguments) }
    addChildAt() { return this.content.addChild(...arguments) }
    removeChildren() { return this.content.removeChildren(...arguments) }
    removeChildAt() { return this.content.removeChildAt(...arguments) }
    removeChild() { return this.content.removeChild(...arguments) }
    setChildIndex() { return this.content.setChildIndex(...arguments) }
    swapChildren() { return this.content.swapChildren(...arguments) }
    toLocal() { return this.content.toLocal(...arguments) }
    toGlobal() { return this.content.toGlobal(...arguments) }
    getChild() { return this.content.getChild(...arguments) }
    getChildAt() { return this.content.getChildAt(...arguments) }
}
const PIXI = require('pixi.js')
const Input = require('yy-input')
const exists = require('exists')

const THEME = require('./theme.json')

module.exports = class UI extends PIXI.Container
{
    /**
     * @param {object} [options]
     * @param {object} [options.theme]
     * @param {object} [options.div]
     * @param {(number|string)} [options.background=transparent] fill in the background with this color
     * @param {number} [options.width=window.innerWidth] width of UI
     * @param {number} [options.height = window.innerHeight] height of UI
     * @param {boolean} [options.preventDefault=false] prevent default on input events
     * @param {boolean} [options.chromeDebug=true] allow ctrl-r to refresh page and ctrl-shift-i to open debug window
     */
    constructor(options)
    {
        super()
        options = options || {}
        this.types = 'UI'
        this.theme = options.theme || THEME
        const preventDefault = options.preventDefault
        const chromeDebug = exists(options.chromeDebug) ? options.chromeDebug : true
        if (options.background)
        {
            this.bg = this.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
            this.bg.tint = options.background
        }
        this.resize(options.width, options.height)
        this.input = new Input({ preventDefault, chromeDebug })
        this.input.on('down', this.down, this)
        this.input.on('move', this.move, this)
        this.input.on('up', this.up, this)
        this.input.on('keydown', this.keydown, this)
        this.input.on('keyup', this.keyup, this)
        this.input.on('wheel', this.wheel, this)
        this.listeners = {}
    }

    /**
     *
     * @param {number} [width=window.innerWidth] of the screen
     * @param {number} [height=window.innerHeight
     */
    resize(width, height)
    {
        this.w = exists(width) ? width : window.innerWidth
        this.h = exists(height) ? height : window.innerHeight
        if (this.bg)
        {
            this.bg.width = this.w
            this.bg.height = this.h
        }
    }

    down(x, y, data)
    {
        function check(parent)
        {
            for (let i = parent.children.length - 1; i >= 0; i--)
            {
                const child = parent.children[i]
                if (check(child))
                {
                    return true
                }
                if (child.visible && child.types && child.windowGraphics.containsPoint(point))
                {
                    if (child.down(x, y, data))
                    {
                        if (selected && selected !== child)
                        {
                            selected.focused = false
                            selected.emit('lose-focus')
                        }
                        that.selected = child
                        that.selected.focused = true
                        that.selected.emit('focus')
                        return true
                    }
                }
            }
        }

        const point = { x, y }
        const selected = this.selected
        const that = this
        if (this.modal)
        {
            if (!check(this.modal))
            {
                this.modal.down(x, y, data)
            }
            return
        }

        // if (selected)
        // {
        //     if (selected.windowGraphics.containsPoint(point) && selected.down(x, y, data))
        //     {
        //         return true
        //     }
        // }
        if (check(this))
        {
            return true
        }
        this.emit('down', x, y, data)
    }

    move(x, y, data)
    {
        function check(parent)
        {
            for (let i = parent.children.length - 1; i >= 0; i--)
            {
                const child = parent.children[i]
                if (check(child))
                {
                    return true
                }
                if (child.visible && child.types)
                {
                    if (child.move(x, y, data))
                    {
                        return true
                    }
                }
            }
        }

        if (this.modal)
        {
            if (!check(this.modal))
            {
                this.modal.move(x, y, data)
            }
            return
        }

        if (check(this))
        {
            data.event.stopPropagation()
            return true
        }
        this.emit('move', x, y, data)
    }

    wheel(dx, dy, dz, data)
    {
        function check(parent)
        {
            for (let i = parent.children.length - 1; i >= 0; i--)
            {
                const child = parent.children[i]
                if (check(child))
                {
                    return true
                }
                if (child.visible && child.types && child.windowGraphics.containsPoint(point))
                {
                    if (child.wheel(dx, dy, dz, data))
                    {
                        data.event.preventDefault()
                        return true
                    }
                }
            }
        }
        const point = { x: data.x, y: data.y }
        if (check(this))
        {
            data.event.stopPropagation()
            return true
        }
        this.emit('wheel', dx, dy, dz, data)
    }

    up(x, y, data)
    {
        function check(parent)
        {
            for (let i = parent.children.length - 1; i >= 0; i--)
            {
                const child = parent.children[i]
                check(child)
                if (child.visible && child.types)
                {
                    if (child.up(x, y, data))
                    {
                        return true
                    }
                }
            }
        }

        if (this.modal)
        {
            if (!check(this.modal))
            {
                this.modal.up(x, y, data)
            }
            return
        }

        if (check(this))
        {
            return true
        }
        this.emit('up', x, y, data)
    }

    keydown(code, special, e)
    {
        function check(parent)
        {
            for (let i = parent.children.length - 1; i >= 0; i--)
            {
                const child = parent.children[i]
                check(child)
                if (child.types)
                {
                    if (child !== selected && child.keydown(code, special, e))
                    {
                        return true
                    }
                }
            }
        }
        const selected = this.selected
        if (selected)
        {
            if (this.selected.keydown(code, special, e))
            {
                return true
            }
        }
        if (check(this))
        {
            return true
        }
        else if (this.listeners['keydown'])
        {
            if (this.listeners['keydown'](code, special, e))
            {
                return true
            }
        }
        this.emit('keydown', code, special, e)
    }

    keyup(code, special, e)
    {
        function check(parent)
        {
            for (let i = parent.children.length - 1; i >= 0; i--)
            {
                const child = parent.children[i]
                check(child)
                if (child.types)
                {
                    if (child !== selected && child.keyup(code, special, e))
                    {
                        return true
                    }
                }
            }
        }
        const selected = this.selected
        if (selected)
        {
            if (selected.keyup(code, special, e))
            {
                e.stopPropagation()
                return
            }
        }
        if (check(this))
        {
            e.stopPropagation()
        }
        else if (this.listeners['keyup'])
        {
            if (this.listeners['keyup'](code, special, e))
            {
                e.stopPropagation()
            }
        }
        this.emit('keyup', code, special, e)
    }

    /**
     *
     * @param {string} type
     * @param {function} callback
     * @param {object} context
     */
    addListener(type, callback)
    {
        this.listeners[type] = callback
    }

    update(elapsed)
    {
        this.modal = false
        let dirty = this.dirty
        const queue = [...this.children]
        let i = 0
        while (i < queue.length)
        {
            const w = queue[i]
            if (w.types)
            {
                w.update(elapsed)
                if (w.dirty)
                {
                    dirty = true
                    w.dirty = false
                }
                if (w.modal)
                {
                    this.modal = w
                }
            }
            queue.push(...w.children)
            i++
        }
        this.dirty = false
        return dirty
    }
}
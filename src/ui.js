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
     * @param {boolean} [options.preventDefault=true] prevent default on input events
     * @param {boolean} [options.chromeDebug=true] allow ctrl-r to refresh page and ctrl-shift-i to open debug window
     */
    constructor(options)
    {
        super()
        options = options || {}
        this.type = 'UI'
        this.theme = options.theme || THEME
        const preventDefault = exists(options.preventDefault) ? options.preventDefault : true
        const chromeDebug = exists(options.chromeDebug) ? options.chromeDebug : true
        this.input = new Input({ preventDefault, chromeDebug })
        this.input.on('down', this.down, this)
        this.input.on('move', this.move, this)
        this.input.on('up', this.up, this)
        this.input.on('keydown', this.keydown, this)
        this.input.on('keyup', this.keyup, this)
        this.input.on('wheel', this.wheel, this)
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
                if (child.types && child.windowGraphics.containsPoint(point))
                {
                    if (child.down(x, y, data))
                    {
                        return true
                    }
                }
            }
        }
        const point = { x, y }
        if (check(this))
        {
            data.event.stopPropagation()
        }
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
                if (child.types)
                {
                    if (child.move(x, y, data))
                    {
                        return true
                    }
                }
            }
        }
        if (check(this))
        {
            data.event.stopPropagation()
        }
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
                if (child.types && child.windowGraphics.containsPoint(point))
                {
                    if (child.wheel(dx, dy, dz, data))
                    {
                        return true
                    }
                }
            }
        }
        const point = { x: data.x, y: data.y }
        if (check(this))
        {
            data.event.stopPropagation()
        }
    }

    up(x, y, data)
    {
        function check(parent)
        {
            for (let i = parent.children.length - 1; i >= 0; i--)
            {
                const child = parent.children[i]
                check(child)
                if (child.types)
                {
                    if (child.up(x, y, data))
                    {
                        return true
                    }
                }
            }
        }
        if (check(this))
        {
            data.event.stopPropagation()
        }
    }

    keydown(code, special, e)
    {
        function check(parent)
        {
            for (let i = parent.children.length - 1; i >= 0; i--)
            {
                const child = parent.children[i]
                if (child.types)
                {
                    check(child)
                    if (child.keydown(code, special, e))
                    {
                        return true
                    }
                }
            }
        }
        if (check(this))
        {
            e.stopPropagation()
        }
    }

    keyup(code, special, e)
    {
        function check(parent)
        {
            for (let i = parent.children.length - 1; i >= 0; i--)
            {
                const child = parent.children[i]
                if (child.types)
                {
                    check(child)
                    if (child.keyup(code, special, e))
                    {
                        return true
                    }
                }
            }
        }
        if (check(this))
        {
            e.stopPropagation()
        }
    }

    update(elapsed)
    {
        this.editing = false
        let dirty
        const queue = [...this.children]
        let i = 0
        while (i < queue.length)
        {
            const w = queue[i]
            if (w.types)
            {
                if (w.editing)
                {
                    this.editing = true
                }
                w.update(elapsed)
                if (w.dirty)
                {
                    dirty = true
                    w.dirty = false
                }
            }
            queue.push(...w.children)
            i++
        }
        return dirty
    }
}
const PIXI = require('pixi.js')

const Window = require('./window')

module.exports = class List extends Window
{
    /**
     * @param {object} [options]
     * @param {boolean} [options.many] select many
     * @emit select (item, List)
     * @emit unselect (item, List)
     */
    constructor(options)
    {
        options = options || {}
        super(options)
        this.types.push('List')
        this.items = []
        this.selected = []
        this.many = options.many
        this.selectGraphics = this.content.addChild(new PIXI.Graphics())
    }

    add(c, noLayout)
    {
        this.items.push(c)
        this.content.addChild(c)
        if (!noLayout)
        {
            this.layout()
        }
        return c
    }

    remove(c, noLayout)
    {
        this.items.splice(this.items.indexOf(c), 1)
        this.content.removeChild(c)
        if (!noLayout)
        {
            this.layout()
        }
    }

    layout()
    {
        const between = this.get('between')
        const spacing = this.get('spacing')
        let width = this.right
        for (let child of this.items)
        {
            width = (child.width > width) ? child.width : width
        }
        this._windowWidth = width + spacing * 2
        let y = 0
        for (let w of this.items)
        {
            w.y = y
            y += w.height + between
        }
        this._windowHeight = y - between + spacing * 2
        super.layout()
        this.showSelected()
    }

    showSelected()
    {
        const spacing = this.get('spacing') * 2
        const color = this.get('background-select-color')
        this.selectGraphics.clear()
        for (let select of this.selected)
        {
            this.selectGraphics
                .beginFill(color)
                .drawRect(0, select.y, this._windowWidth - spacing, select.height)
                .endFill()
        }
    }

    down(x, y)
    {
        const point = { x, y }
        for (let item of this.items)
        {
            if (item.containsPoint(point))
            {
                if (this.many)
                {
                    const index = this.selected.indexOf(item)
                    if (index !== -1)
                    {
                        this.emit('unselect', item, this)
                        this.selected.splice(index, 1)
                    }
                    else
                    {
                        this.emit('select', item, this)
                        this.selected.push(item)
                    }
                    this.layout()
                }
                else
                {
                    if (this.selected[0] !== item)
                    {
                        this.emit('select', item, this)
                        this.selected[0] = item
                        this.layout()
                    }
                }
                return true
            }
        }
    }
}
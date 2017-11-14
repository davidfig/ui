const Base = require('./base')
const exists = require('exists')

module.exports = class Stack extends Base
{
    /**
     * @param {Array} [items] items to add
     * @param {object} [options]
     * @param {boolean} [options.horizontal] horizontal instead of vertical
     * @param {boolean} [options.sameWidth]
     * @param {boolean} [options.sameHeight]
     * @param {string} [options.justify=center] left or right (justify in the non-stacked direction)
     */
    constructor(items, options)
    {
        if (!Array.isArray(items))
        {
            options = items
            items = null
        }
        options = options || {}
        options.transparent = exists(options.transparent) ? options.transparent : true
        super(options)
        this.types.push('Stack')
        this.horizontal = options.horizontal
        this.sameWidth = options.sameWidth
        this.sameHeight = options.sameHeight
        this.justify = options.justify
        this.items = []
        if (items)
        {
            for (let item of items)
            {
                this.add(item, true)
            }
        }
        this.layout()
    }

    add(c, noReflow)
    {
        this.items.push(c)
        this.addChild(c)
        if (!noReflow)
        {
            this.layout()
        }
    }

    remove(c, noReflow)
    {
        this.items.splice(this.items.indexOf(c), 1)
        this.removeChild(c)
        if (!noReflow)
        {
            this.layout()
        }
    }

    layout()
    {
        for (let item of this.items)
        {
            if (item.types)
            {
                item.layout()
            }
        }
        const between = this.get('between')
        const spacing = this.get('spacing')
        let width = spacing, height = spacing, largestWidth = 0, largestHeight = 0
        for (let w of this.items)
        {
            largestWidth = (w.width > largestWidth) ? w.width : largestWidth
            largestHeight = (w.height > largestHeight) ? w.height : largestHeight
            width += w.width + between
            height += w.height + between
        }
        width = width - between + spacing
        height = height - between + spacing
        if (this.sameWidth)
        {
            for (let w of this.items)
            {
                if (w.width !== largestWidth)
                {
                    width += (largestWidth - w.width)
                    w.width = largestWidth
                    w.layout()
                }
            }
        }
        if (this.sameHeight)
        {
            for (let w of this.items)
            {
                if (w.height !== largestHeight)
                {
                    height += (largestHeight - w.height)
                    w.height = largestHeight
                    w.layout()
                }
            }
        }
        if (this.horizontal)
        {
            this._windowWidth = width
            this._windowHeight = largestHeight + spacing * 2
        }
        else
        {
            this._windowWidth = largestWidth + spacing * 2
            this._windowHeight = height
        }
        let i = 0
        for (let w of this.items)
        {
            if (this.horizontal)
            {
                w.x = i
                i += w.width + between
                // switch (this.justify)
                // {
                //     case 'left':
                //         w.y = spacing
                //         break

                //     case 'right':
                //         w.y = spacing * 2 + largestHeight - w.width
                //         break

                //     default:
                //         w.y = largestHeight / 2 - w.height / 2 + spacing
                // }
            }
            else
            {
                w.y = i
                i += w.height + spacing
                switch (this.justify)
                {
                    case 'left':
                        w.x = spacing
                        break

                    case 'right':
                        w.x = spacing * 2 + largestWidth - w.width
                        break

                    default:
                        w.x = largestWidth / 2 - w.width / 2 + spacing
                }
            }
        }
        super.layout()
    }
}
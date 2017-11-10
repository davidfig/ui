const exists = require('exists')
const PIXI = require('pixi.js')

const Window = require('./window')

module.exports = class Button extends Window
{
    /**
     * @param {object} [options]
     * @param {string} [options.text]
     * @param {PIXI.TextStyle} [options.textStyle]
     * @param {string=center} [options.align] combination of left/right/center and top/bottom/center or center (e.g., 'center-bottom')
     * @param {texture} [options.sprite]
     * @param {boolean} [options.fit=true]
     */
    constructor(options)
    {
        options = options || {}
        options.clickable = exists(options.clickable) ? options.clickable : true
        options.cursor = exists(options.cursor) ? options.cursor : 'pointer'
        options.fit = exists(options.fit) ? options.fit : true
        super(options)
        this.align = options.align || 'center'
        this.types.push('Button')
        if (exists(options.text))
        {
            options.textStyle = options.textStyle || {}
            options.textStyle.fontFamily = options.textStyle.fontFamily || this.get('font-family')
            options.textStyle.fontSize = options.textStyle.fontSize || this.get('font-size')
            this.label = this.addChild(new PIXI.Text(options.text, options.textStyle))
        }
        else if (options.sprite)
        {
            this.sprite = this.addChild(options.sprite)
        }
        this._select = options.select
        this.layout()
    }

    layout()
    {
        const item = this.label ? this.label : this.text

        if (this.noFitX)
        {
            if (this.align.indexOf('left') !== -1)
            {
                item.x = 0
            }
            else if (this.align.indexOf('right') !== -1)
            {
                item.x = this.right - item.width
            }
            else
            {
                item.x = this.center.x - item.width / 2
            }
        }
        if (this.noFitY)
        {
            if (this.align.indexOf('top') !== -1)
            {
                item.y = 0
            }
            else if (this.align.indexOf('bottom') !== -1)
            {
                item.y = this.bottom - item.height
            }
            else
            {
                item.y = this.center.y - item.height / 2
            }
        }
        super.layout()
    }

    get select()
    {
        return this._select
    }
    set select(value)
    {
        this._select = value
        this.drawWindowShape()
    }

    get text()
    {
        return this._text
    }
    set text(value)
    {
        this._text = value
        this.dirty = true
    }

    drawWindowShape()
    {
        super.drawWindowShape()
        if (this.isDown || this.select)
        {
            const shadow = this.get('shadow-size')
            this.windowGraphics
                .clear()
                .beginFill(this.get('background-select-color'))
                .drawRoundedRect(shadow, shadow, this._windowWidth - shadow * 2, this._windowHeight - shadow * 2, this.get('corners'))
                .endFill()
        }
    }

    down(e)
    {
        this.isDown = true
        this.drawWindowShape()
        this.emit('pressed', this)
        e.stopPropagation()
    }

    move(e)
    {
        if (this.isDown)
        {
            if (!this.windowGraphics.containsPoint(e.data.global))
            {
                this.isDown = false
                this.drawWindowShape()
            }
            e.stopPropagation()
        }
    }

    up()
    {
        if (this.isDown)
        {
            this.emit('clicked', this)
        }
        this.isDown = false
        this.drawWindowShape()
    }
}
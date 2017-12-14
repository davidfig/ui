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
        super.layout()
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
        if (this.label)
        {
            this.label.alpha = this.disabled ? this.get('disabled-alpha') : 1
        }
        if (this.sprite)
        {
            this.sprite.alpha = this.disabled ? this.get('disabled-alpha') : 1
        }
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
        this.layout()
        this.dirty = true
    }

    get disabled()
    {
        return this._disabled
    }
    set disabled(value)
    {
        if (value !== this._disabled)
        {
            this._disabled = value
            this.layout()
        }
    }

    drawWindowShape()
    {
        super.drawWindowShape()
        if (this.isButtonDown || this.select)
        {
            const shadow = this.get('shadow-size')
            this.windowGraphics
                .clear()
                .beginFill(this.get('background-select-color'))
                .drawRect(shadow, shadow, this._windowWidth - shadow * 2, this._windowHeight - shadow * 2)
                .endFill()
        }
    }

    down()
    {
        super.down(...arguments)
        if (!this.disabled)
        {
            this.isButtonDown = true
            this.drawWindowShape()
            this.emit('pressed', this)
            return true
        }
    }

    move(x, y)
    {
        super.move(...arguments)
        if (this.isButtonDown)
        {
            if (!this.windowGraphics.containsPoint({ x, y }))
            {
                this.isButtonDown = false
                this.drawWindowShape()
            }
            return true
        }
    }

    up()
    {
        super.up(...arguments)
        if (this.isButtonDown)
        {
            this.isButtonDown = false
            this.drawWindowShape()
            this.emit('clicked', this)
            return true
        }
    }
}
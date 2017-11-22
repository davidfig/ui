const PIXI = require('pixi.js')
const exists = require('exists')

const Window = require('./window')

module.exports = class Text extends Window
{
    /**
     * @param {string} text
     * @param {object} [options]
     * @param {PIXI.TextStyle} [options.textStyle]
     */
    constructor(text, options)
    {
        options = options || {}
        options.transparent = exists(options.transparent) ? options.transparent : true
        options.fit = exists(options.fit) ? options.fit : true
        super(options)
        this.types.push('Text')
        const style = options.textStyle || {}
        style.fontFamily = style.fontFamily || this.get('font-family')
        style.fontSize = style.fontSize || this.get('font-size')
        style.fill = style.fill || this.get('foreground-color')
        this.label = this.content.addChild(new PIXI.Text(text, style))
    }

    layout()
    {
        this.label.style.fill = this.get('foreground-color')
        super.layout()
    }

    containsPoint(point)
    {
        return this.label.containsPoint(point)
    }

    get text()
    {
        return this.label.text
    }
    set text(value)
    {
        this.label.text = value
    }
}
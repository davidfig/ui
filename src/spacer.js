const exists = require('exists')

const Window = require('./window')

module.exports = class Text extends Window
{
    /**
     * @param {string} text
     * @param {object} [options]
     */
    constructor(width, height, options)
    {
        options = options || {}
        options.transparent = exists(options.transparent) ? options.transparent : true
        super(options)
        this.types.push('Spacer')
    }

    containsPoint(point)
    {
        return this.label.containsPoint(point)
    }
}
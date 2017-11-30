const exists = require('exists')

const Window = require('./window')

module.exports = class Spacer extends Window
{
    /**
     * @param {number} width
     * @param {number} height
     * @param {object} [options]
     */
    constructor(width, height, options)
    {
        options = options || {}
        options.transparent = exists(options.transparent) ? options.transparent : true
        options.width = width
        options.height = height
        super(options)
        this.types.push('Spacer')
    }
}
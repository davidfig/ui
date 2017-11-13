const Base = require('./base')

module.exports = class Window extends Base
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
     * @param {boolean|string} [options.scroll] true, 'X', or 'Y'
     * @param {object} [options.theme]
     */
    constructor(options)
    {
        super(options)
        this.layout()
    }
}
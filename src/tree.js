const PIXI = require('pixi.js')
const exists = require('exists')
const Pixel = require('yy-pixel').Pixel
const RenderSheet = require('yy-rendersheet')

const UI = require('../')
const FOLDER = require('../images/folder.json')

module.exports = class Tree extends UI.Window
{
    /**
     * @param {object} [options]
     */
    constructor(options)
    {
        options = options || {}
        options.transparent = exists(options.transparent) ? options.transparent : true
        options.overflow = exists(options.overflow) ? options.overflow : true
        super(options)
        this.types.push('Tree')
        this.root = { type: 'folder', children: [] }
        this.sheet = new RenderSheet({ scaleMode: PIXI.SCALE_MODES.NEAREST })
        Pixel.add(FOLDER, this.sheet)
        this.sheet.render()
        this.folderTexture = this.sheet.getTexture('folder-0')
        this.folderOpenTexture = this.sheet.getTexture('folder-1')
        this.folders = []
        this.entries = []
    }

    /**
     *
     * @param {object} [parent]
     * @param {object} [options]
     * @param {string} [options.name]
     * @param {string} [options.noLayout]
     * @param {number} [options.index]
     */
    addFolder(parent, options)
    {
        options = options || {}
        parent = parent || this.root
        const folder = options || {}
        folder.type = 'folder'
        folder.children = []
        if (exists(options.index))
        {
            parent.children.splice(options.index, 0, folder)
        }
        else
        {
            parent.children.push(folder)
        }
        if (!options.noLayout)
        {
            this.layout()
        }
        return folder
    }

    /**
     *
     * @param {object} [parent]
     * @param {object} [options]
     * @param {string} [options.name]
     * @param {string} [options.noLayout]
     * @param {number} [options.index]
     */
    addEntry(parent, options)
    {
        parent = parent || this.root
        const entry = options || {}
        entry.type = 'entry'
        if (exists(options.index))
        {
            parent.children.splice(options.index, 0, entry)
        }
        else
        {
            parent.children.push(entry)
        }
        if (!options.noLayout)
        {
            this.layout()
        }
        return entry
    }

    draw(data)
    {
        if (data.type === 'folder')
        {
            this.drawFolder(data)
        }
        else if (data.type === 'entry')
        {
            this.drawEntry(data)
        }
    }

    drawFolder(data)
    {
        const icon = new PIXI.Sprite(data.collapsed ? this.folderTexture : this.folderOpenTexture)
        const text = new UI.Text(data.name, { theme: { spacing: 0 }})
        icon.width = icon.height = text.label.height
        const stack = this.content.addChild(new UI.Stack([icon, text], { horizontal: true }))
        this.folders.push({ stack, data })
        stack.position.set(this.currentIndent, this.current)
        this.current += stack.height + this.get('between')
        if (!data.collapsed)
        {
            const indent = this.get('indent')
            this.currentIndent += indent
            for (let child of data.children)
            {
                this.draw(child)
            }
            this.currentIndent -= indent
        }
    }

    drawEntry(data)
    {
        const text = this.content.addChild(new UI.Text(data.name, { theme: { spacing: 0 } }))
        text.position.set(this.currentIndent, this.current)
        this.current += text.height + this.get('between')
        this.entries.push({ text, data })
    }

    layout()
    {
        this.folders = []
        this.entries = []
        this.removeChildren()
        this.current = 0
        this.currentIndent = 0
        for (let child of this.root.children)
        {
            this.draw(child)
        }
        super.layout()
    }

    down(x, y)
    {
        const point = { x, y }
        for (let folder of this.folders)
        {
            if (folder.stack.items[0].containsPoint(point))
            {
                folder.data.collapsed = !folder.data.collapsed
                this.layout()
                return true
            }
        }
    }
}
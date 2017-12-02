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
     * @param {boolean} [options.entryMove]
     * @param {boolean} [options.noFolderSelection]
     * @param {boolean} [options.noEntrySelection]
     * @emit select (item, List)
     * @emit unselect (item, List)
     */
    constructor(options)
    {
        options = options || {}
        options.transparent = exists(options.transparent) ? options.transparent : false
        options.overflow = exists(options.overflow) ? options.overflow : true
        super(options)
        this.types.push('Tree')
        this.root = { type: 'folder', children: [] }
        this.noFolderSelection = options.noFolderSelection
        this.noEntrySelection = options.noEntrySelection
        this.sheet = new RenderSheet({ scaleMode: PIXI.SCALE_MODES.NEAREST })
        Pixel.add(FOLDER, this.sheet)
        this.sheet.render()
        this.folderTexture = this.sheet.getTexture('folder-0')
        this.folderOpenTexture = this.sheet.getTexture('folder-1')
        this.selectGraphics = this.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
        this.selectGraphics.tint = this.get('background-select-color')
        this.selectGraphics.visible = false
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
        folder.icon = new PIXI.Sprite(this.folderOpenTexture)
        folder.text = new UI.Text(options.name, { theme: { spacing: 0 } })
        folder.icon.width = folder.icon.height = folder.text.label.height
        folder.stack = this.addChild(new UI.Stack([folder.icon, folder.text], { horizontal: true }))
        this.indent = folder.icon.width + folder.stack.get('between')
        this.folders.push(folder)
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
        this.folders.push(folder)
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
        entry.text = this.addChild(new UI.Text(options.name, { theme: { spacing: 0 } }))
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
        this.entries.push(entry)
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

    drawFolder(folder)
    {
        if (this.isVisible)
        {
            folder.stack.visible = true
            folder.stack.position.set(this.currentIndent, this.current)
            if (this.selected && this.selected === folder)
            {
                this.selectGraphics.position.set(this.currentIndent + folder.icon.width + folder.stack.get('between'), this.current)
                this.selectGraphics.width = folder.text.width
                this.selectGraphics.height = folder.text.height
                this.selectGraphics.visible = true
            }
            this.current += folder.stack.height + this.get('between')
            if (folder.collapsed)
            {
                folder.icon.texture = this.folderTexture
                this.isVisible = false
            }
            else
            {
                folder.icon.texture = this.folderOpenTexture
                this.currentIndent += this.get('indent')
            }
            for (let child of folder.children)
            {
                this.draw(child)
            }
            if (!folder.collapsed)
            {
                this.currentIndent -= this.get('indent')
            }
            this.isVisible = true
        }
        else
        {
            folder.stack.visible = false
            for (let child of folder.children)
            {
                this.draw(child)
            }
        }
    }

    drawEntry(entry)
    {
        if (this.isVisible)
        {
            entry.text.visible = true
            entry.text.position.set(this.currentIndent, this.current)
            if (this.selected && this.selected === entry)
            {
                this.selectGraphics.position.set(this.currentIndent, this.current)
                this.selectGraphics.width = entry.text.width
                this.selectGraphics.height = entry.text.height
                this.selectGraphics.visible = true
            }
            this.current += entry.text.height + this.get('between')
        }
        else
        {
            entry.text.visible = false
        }
    }

    layout()
    {
        this.selectGraphics.visible = false
        this.current = 0
        this.currentIndent = 0
        this.isVisible = true
        for (let child of this.root.children)
        {
            this.draw(child)
        }
        super.layout()
    }

    change(item)
    {
        if (this.selected !== item)
        {
            if (this.selected)
            {
                this.emit('unselect', this.selected)
            }
            this.selected = item
            this.emit('select', this.selected)
            this.layout()
        }
    }

    down(x, y)
    {
        const point = { x, y }
        for (let folder of this.folders)
        {
            if (folder.stack.items[0].containsPoint(point))
            {
                folder.collapsed = !folder.collapsed
                this.layout()
                return true
            }
            else if (!this.noFolderSelection && folder.stack.items[1].containsPoint(point))
            {
                this.change(folder)
                return true
            }
        }
        if (!this.noEntrySelection)
        {
            for (let entry of this.entries)
            {
                if (entry.text.containsPoint(point))
                {
                    this.change(entry)
                    return true
                }
            }
        }
    }

    previous(original)
    {
        function traverse(start)
        {
            for (let child of start.children)
            {
                if (child === original)
                {
                    return last
                }
                if (child.type === 'folder')
                {
                    last = child
                    const result = traverse(child)
                    if (result)
                    {
                        return result
                    }
                }
                else
                {
                    last = child
                }
            }
        }
        let last = this.root.children[0]
        return traverse(this.root)
    }

    next(original)
    {
        function traverse(start)
        {
            for (let child of start.children)
            {
                if (next)
                {
                    return child
                }
                if (child === original)
                {
                    next = true
                }
                if (child.type === 'folder')
                {
                    const result = traverse(child)
                    if (result)
                    {
                        return result
                    }
                }
            }
        }
        let next
        return traverse(this.root)
    }

    keydown(code, special)
    {
        if (this.isFocused())
        {
            if (!special.ctrl && !special.meta && !special.shift)
            {
                switch (code)
                {
                    case 37: // left
                        if (this.selected && this.selected.type === 'folder')
                        {
                            this.selected.collapsed = true
                            this.layout()
                        }
                        break
                    case 39: // right
                        if (this.selected && this.selected.type === 'folder')
                        {
                            this.selected.collapsed = false
                            this.layout()
                        }
                        break
                    case 38: //up
                        if (this.selected)
                        {
                            const previous = this.previous(this.selected)
                            if (previous)
                            {
                                if (this.viewport)
                                {
                                    const center = this.viewport.center
                                    this.viewport.moveCenter(center.x, center.y - previous.height)
                                }
                                this.change(previous)
                            }
                        }
                        break
                    case 40: //down
                        if (this.selected)
                        {
                            const next = this.next(this.selected)
                            if (next)
                            {
                                if (this.viewport)
                                {
                                    const center = this.viewport.center
                                    this.viewport.moveCenter(center.x, center.y + next.height)
                                }
                                this.change(next)
                            }
                        }
                }
            }
            console.log(code)
        }
    }
}
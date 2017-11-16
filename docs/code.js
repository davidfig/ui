const PIXI = require('pixi.js')
const Random = require('yy-random')
const Renderer = require('yy-renderer')

const UI = require('..')

let renderer, ui

function test()
{
    renderer = new Renderer({ debug: true, autoresize: true })

    ui = renderer.addChild(new UI({ div: renderer.canvas }))

    dialogSetup()
    scrollSetup()
    listSetup()
    treeSetup()

    renderer.interval(update)
    renderer.start()
}

let scroll

function scrollSetup()
{
    scroll = ui.addChild(new UI.Window({ resizeable: true, draggable: true, width: 500, height: 300, overflow: true }))
    const interval = 10
    for (let y = 20; y < scroll.bottom * 3; y += interval)
    {
        for (let x = 0; x < scroll.right; x += interval)
        {
            const box = scroll.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
            box.tint = Random.color()
            box.width = box.height = interval
            box.position.set(x, y)
        }
    }
    scroll.position.set(220, 10)
    scroll.layout()
}

function dialogSetup()
{
    const dialog = ui.addChild(new UI.Window({ draggable: true, resizeable: true, width: 200, height: 100 }))
    dialog.position.set(10, 10)
    dialog.addChild(new UI.Stack([new UI.Button({ text: 'OK' }), new UI.Button({ text: 'Cancel' })], { horizontal: true, sameWidth: true, place: 'bottom' }))
    dialog.addChild(new UI.EditText('edit me!', { maxCount: 10, count: 10, align: 'right', place: 'top-center', count: 5 }))
    dialog.theme['minimum-width'] = 200
    dialog.theme['minimum-height'] = 100
}

function listSetup()
{
    const window = ui.addChild(new UI.Window({ draggable: true, resizeable: true, overflow: true, fitX: true, noOversizeY: true, height: 200}))
    const list = window.addChild(new UI.List({ many: true }))
    for (let i = 0; i < 10; i++)
    {
        list.add(new UI.Text('Item #' + i), true)
    }
    list.layout()
    window.layout()
    window.position.set(10, 130)
}

function treeSetup()
{
    const window = ui.addChild(new UI.Window({ draggable: true, resizeable: true, overflow: true, width: 250, height: 400 }))
    const tree = window.addChild(new UI.Tree({ fit: true }))
    window.position.set(220, 320)
    for (let i = 0; i < 5; i++)
    {
        const folder = tree.addFolder(null, { name: 'folder-' + i, noLayout: true })
        let n = Random.get(10)
        for (let j = 0; j < n; j++)
        {
            if (Random.chance(0.2))
            {
                const level2 = tree.addFolder(folder, { name: 'level-2-folder-' + i, noLayout: true })
                const n2 = Random.get(10)
                for (let k = 0; k < n2; k++)
                {
                    tree.addEntry(level2, { name: 'level-2-entry-' + k, noLayout: true})
                }
            }
            else
            {
                tree.addEntry(folder, { name: 'entry-' + j, noLayout: true })
            }
        }
    }
    window.layout()
}

function update()
{
    if (ui.update())
    {
        renderer.dirty = true
    }
}

window.onload = function ()
{
    test()

    require('fork-me-github')('https://github.com/davidfig/ui')
    require('./highlight')()
}
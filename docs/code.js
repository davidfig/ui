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

    renderer.interval(update)
    renderer.start()
}

let scroll

function scrollSetup()
{
    scroll = ui.addChild(new UI.window({ resizeable: true, draggable: true, width: 500, height: 300, overflow: true }))
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

let dialog, OK, Cancel, edit

function dialogSetup()
{
    dialog = ui.addChild(new UI.window({ draggable: true, resizeable: true, width: 200, height: 100 }))
    dialog.position.set(10, 10)
    OK = dialog.addChild(new UI.button({ text: 'OK' }))
    Cancel = dialog.addChild(new UI.button( { text: 'Cancel' }))
    OK.width = Cancel.width
    edit = dialog.addChild(new UI.editText('edit me!', { maxCount: 10, align: 'center', count: 5 }))
    edit.on('changed', dialogLayout)
    dialog.on('resizing', dialogLayout)

    dialogLayout()

    dialog.theme['minimum-width'] = 200
    dialog.theme['minimum-height'] = 100
}

function dialogLayout()
{
    const spacing = 5
    OK.position.set(dialog.center.x - OK.width - spacing, dialog.bottom - OK.height)
    Cancel.position.set(dialog.center.x + spacing, dialog.bottom - Cancel.height)
    edit.position.set(dialog.center.x - edit.width / 2, 0)
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
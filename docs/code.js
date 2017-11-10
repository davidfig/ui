const Renderer = require('yy-renderer')

const UI = require('..')

let renderer, ui, dialog, OK, Cancel, edit

function test()
{
    renderer = new Renderer({ debug: true })

    ui = renderer.addChild(new UI())

    dialog = ui.addChild(new UI.window({ draggable: true, resizeable: true, width: 200, height: 100, titlebar: 'test' }))
    dialog.centerToDesktop()
    OK = dialog.addChild(new UI.button({ text: 'OK' }))
    Cancel = dialog.addChild(new UI.button( { text: 'Cancel' }))
    OK.width = Cancel.width
    edit = dialog.addChild(new UI.editText('edit me!', { maxCount: 10, align: 'center', count: 5 }))
    edit.on('changed', layout)

    layout()
    dialog.on('resizing', layout)

    dialog.theme['minimum-width'] = 200
    dialog.theme['minimum-height'] = 100

    renderer.interval(update)
    renderer.start()
}

function layout()
{
    const spacing = 5
    OK.position.set(dialog.center.x - OK.width - spacing, dialog.bottom - OK.height)
    Cancel.position.set(dialog.center.x + spacing, dialog.bottom - Cancel.height)
    edit.position.set(dialog.center.x - edit.width / 2, 0)
}

function update()
{
    renderer.dirty = ui.update()
}

window.onload = function ()
{
    test()

    require('fork-me-github')('https://github.com/davidfig/ui')
    require('./highlight')()
}
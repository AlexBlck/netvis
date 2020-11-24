const { ipcRenderer } = require('electron')

var stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true,
});

var block_layer = new Konva.Layer()
stage.add(block_layer)

// Handle window resize
function fitStageIntoParentContainer() {
    stage.width(window.innerWidth)
    stage.height(window.innerHeight)
    //stage.absolutePosition({x: 0, y: 0})
    stage.draw()
}
ipcRenderer.on('resize', fitStageIntoParentContainer)

function init_button(box){
    // add cursor styling
    box.on('mouseover', function () {
        document.body.style.cursor = 'pointer'
    });
    box.on('mouseout', function () {
        document.body.style.cursor = 'default'
    });

    box.on('dragstart', function (evt){
        var new_button = evt.target.clone({id: 'button'})
        evt.target.off('dragstart')
        evt.target.off('click')
        var blocks = stage.find('#last')
        for (var block of blocks){
            block.id('block')
        }
        evt.target.id('last')

        block_layer.add(new_button)
        block_layer.draw()
    })

    box.on('click', function (evt){

        var blocks = stage.find('#last')
        if(blocks.length >= 1){
            last_block = blocks[blocks.length - 1]
            var new_x = last_block.attrs.x + last_block.attrs.width + 25
            var new_y = last_block.attrs.y + last_block.attrs.height / 2 - evt.target.attrs.height / 2
        }else{
            new_x = 25
            new_y = 100
        }

        for (var block of blocks){
            block.id('block')
        }
        var new_button = evt.target.clone({x: new_x, y: new_y, id: 'last'})
        new_button.off('dragstart')
        new_button.off('click')

        block_layer.add(new_button)
        block_layer.draw()

        if(blocks.length >= 1)
            draw_arrow(last_block, new_button)
    })

}


// Buttons
fc = new Konva.Rect({
    x: 25,
    y: stage.height() - 75 - 50,
    width: 25,
    height: 100,
    fill: '#71ace7',
    stroke: 'white',
    strokeWidth: 2,
    draggable: true,
    id: 'button'
});

conv = new Konva.Rect({
    x: 25 + 35,
    y: stage.height() - 75 - 25,
    width: 50,
    height: 50,
    fill: '#75e771',
    stroke: 'white',
    strokeWidth: 2,
    draggable: true,
    id: 'button'
});

init_button(fc)
init_button(conv)
block_layer.add(fc)
block_layer.add(conv)
block_layer.draw()


function last_red(){
    var all_blocks = stage.find('Rect')
    for (var block of all_blocks){
        if(block.id() !== 'button'){
            block.fill('#71ace7')
            block_layer.draw()
        }
    }

    var last_blocks = stage.find('#last')
    for (var block of last_blocks){
        block.fill('red')
        block_layer.draw()
    }

}

// setInterval(last_red, 60)

var arrows = []
function draw_arrow(from, to){
    var arrow = new Konva.Arrow({
        points: [from.attrs.x + from.attrs.width, from.attrs.y + from.attrs.height / 2,
            from.attrs.x + from.attrs.width + 30, from.attrs.y + from.attrs.height / 2,
            to.attrs.x, to.attrs.y + to.attrs.height / 2],
        pointerLength: 5,
        pointerWidth: 5,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 4,
        tension: 0.2
    })

    arrows.push({arrow: arrow, to: to, from: from})

    block_layer.add(arrow)
    block_layer.draw()
}

function update_arrows(){
    for (var arrow of arrows){
        var to = arrow.to
        var from = arrow.from
        var line = arrow.arrow
        line.points([from.attrs.x + from.attrs.width, from.attrs.y + from.attrs.height / 2,
            from.attrs.x + from.attrs.width + 20, from.attrs.y + from.attrs.height / 2,
            to.attrs.x - 20, to.attrs.y + to.attrs.height / 2,
            to.attrs.x, to.attrs.y + to.attrs.height / 2])
    }
    block_layer.draw()
}
setInterval(update_arrows, 10)

function update_ui(){
    var blocks = stage.find('#button')
    var i = 0;
    for (var block of blocks){
        block.position({x: 25 + 35 * i - stage.absolutePosition().x, y: stage.height() - 75 - stage.absolutePosition().y - block.attrs.height/2})
        i++
    }

}

stage.on('dragmove', update_ui)
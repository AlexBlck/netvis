const { ipcRenderer } = require('electron');

const margin = 0

var stageWidth = window.innerWidth;
var stageHeight = window.innerHeight - margin;

var stage = new Konva.Stage({
    container: 'container',
    width: stageWidth,
    height: stageHeight
});
stage.container().style.border = '0px solid black';

var main_layer = new Konva.Layer();
stage.add(main_layer);

function fitStageIntoParentContainer() {
    stage.width(window.innerWidth);
    stage.height(window.innerHeight - margin);
    stage.absolutePosition({x: 0, y: 0});
    stage.draw();
}

class Block {
    constructor(layer, pos, isbutton, width, height, fill, stroke) {
        Block.prototype.width = width;
        Block.prototype.height = height;
        this.isbutton = isbutton;
        this.layer = layer;

        this.box = new Konva.Rect({
            x: pos.x,
            y: pos.y,
            width: width,
            height: height,
            fill: fill,
            stroke: stroke,
            strokeWidth: 2,
            draggable: !isbutton,
        });

        layer.add(this.box);
        layer.draw();
    }
}


class ConvBlock extends Block{
    constructor(layer, pos, isbutton) {
        var height = 50;
        super(layer, pos, isbutton, 50, 50, '#5dd758', 'white');

        if(this.isbutton)
        {
            // add cursor styling
            this.box.on('mouseover', function () {
                document.body.style.cursor = 'pointer';
            });
            this.box.on('mouseout', function () {
                document.body.style.cursor = 'default';
            });

            this.box.on('click', function (evt) {
                if(layer.children.length > 2){
                    var lastbox = layer.children[layer.children.length - 1];
                    var y = lastbox.attrs.y + lastbox.attrs.height / 2 - height / 2;
                    new ConvBlock(layer, {x: lastbox.attrs.x + lastbox.attrs.width + 25, y: y});
                }else{
                    new ConvBlock(layer, {x: 50, y: 200});
                }
            })
        }

    }

}

class FcBlock extends Block{
    constructor(layer, pos, isbutton) {
        var height = 100;
        super(layer, pos, isbutton, 25, height, '#5097de', 'white');

        if(isbutton)
        {
            // add cursor styling
            this.box.on('mouseover', function () {
                document.body.style.cursor = 'pointer';
            });
            this.box.on('mouseout', function () {
                document.body.style.cursor = 'default';
            });

            this.box.on('click', function (evt) {
                if(layer.children.length > 2){
                    var lastbox = layer.children[layer.children.length - 1];
                    var y = lastbox.attrs.y + lastbox.attrs.height / 2 - height / 2;
                    new FcBlock(layer, {x: lastbox.attrs.x + lastbox.attrs.width + 25, y: y});
                }else{
                    new FcBlock(layer, {x: 50, y: 200});
                }
            })
        }
    }
}

new ConvBlock(main_layer, {x: 25, y: stage.height() - 100}, true);
new FcBlock(main_layer, {x: 100, y: stage.height() - 125}, true);

ipcRenderer.on('resize', fitStageIntoParentContainer);
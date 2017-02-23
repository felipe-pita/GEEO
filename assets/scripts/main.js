// convertor de cores
function color(hex) { return hex.replace('#', '0x') }

// opções
var game = {
	width: 300,
	height: 500,
	background: color('#323232'),
	antialias: true,
};

// Define o render
game.renderer = PIXI.autoDetectRenderer(game.width, game.height, { backgroundColor: game.background, antialias: game.antialias });

// Define o stage
game.stage = new PIXI.Container();

// Cria o canvas
document.body.appendChild(game.renderer.view);

// Loader
PIXI.loader
  .add("images/ball.png")
  .load(init);



// Gera os controladores
var panel = {};

// Fundo
panel.background = function() {
	var panelBase = new PIXI.Graphics();
	panelBase.beginFill(color('#4c4c4c'));
	panelBase.drawEllipse(0, 0, (game.width / 2) + 20, (game.width / 2) + 20);
	panelBase.endFill();
	panelBase.x = game.width / 2;
	panelBase.y = game.height;
	game.stage.addChild(panelBase);
};


// Elementos
var shapes = {}

// circulo
shapes.circle = function() {
	var shape = new PIXI.Graphics();

	var shape = new PIXI.Sprite( 
		PIXI.loader.resources["images/ball.png"].texture
	);

	game.stage.addChild(shape);
};

// circulo
shapes.square = function() {
	var shape = new PIXI.Graphics();
	shape.lineStyle(2, color('#c066e7'));
	shape.drawRect(10, 80, 64, 64);
	shape.x = 0;
	shape.y = 0;
	shape.rotation = 0.5;

	console.log(shape);
	game.stage.addChild(shape);
};


// Carrega os objetos dos painel
function init() {
	panel.background();
	shapes.circle();
	shapes.square();
}

panel.background();

// Renderiza
game.renderer.render(game.stage);
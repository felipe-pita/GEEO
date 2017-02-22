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

// Carrega os objetos dos painel
panel.background();

// Renderiza
game.renderer.render(game.stage);
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
PIXI.loader.add("images/ball.png").load(setup);

// Setup
function setup() {

	/*
	 * Controladores
	 */
	
	// Fundo
	panelBase = new PIXI.Graphics();
	panelBase.beginFill(color('#4c4c4c'));
	panelBase.drawEllipse(0, 0, (game.width / 2) + 20, (game.width / 2) + 20);
	panelBase.endFill();
	panelBase.x = game.width / 2;
	panelBase.y = game.height;
	game.stage.addChild(panelBase);



	/*
	 * Elementos
	 */

	// Circulo
	shapesCircle = new PIXI.Sprite( 
		PIXI.loader.resources["images/ball.png"].texture
	);
	game.stage.addChild(shapesCircle);
	
	// Quadrado
	shapesSquare = new PIXI.Sprite( 
		PIXI.loader.resources["images/ball.png"].texture
	);
	game.stage.addChild(shapesCircle);





	var bullets = [];  
	var bulletSpeed = 5;

	function shoot(rotation, startPosition){  
	  var bullet = new PIXI.Sprite( PIXI.loader.resources["images/ball.png"].texture );
	  bullet.position.x = startPosition.x;
	  bullet.position.y = startPosition.y;
	  bullet.rotation = rotation;
	  stage.addChild(bullet);
	  bullets.push(bullet);
	}

	function rotateToPoint(mx, my, px, py){  
	  var self = this;
	  var dist_Y = my - py;
	  var dist_X = mx - py;
	  var angle = Math.atan2(dist_Y,dist_X);
	  //var degrees = angle * 180/ Math.PI;
	  return angle;
	}

}

// Loop
function gameLoop(){

	//Loop this function 60 times per second
	requestAnimationFrame(gameLoop);

	//Render the stage
	game.renderer.render(game.stage);
}

gameLoop();
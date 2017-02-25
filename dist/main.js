// options
var gameWidth = 300,
	gameHeight = 500,
	gameBackground = '0x323232';

// render
renderer = PIXI.autoDetectRenderer(gameWidth, gameHeight, {antialias: true});

// stage
stage = new PIXI.Container();

// canvas
document.body.appendChild(renderer.view);

// Background
var background = new PIXI.Graphics();  
	background.beginFill(gameBackground);  
	background.drawRect(0, 0, gameWidth, gameHeight);  
	background.endFill();  
	
	stage.addChild(background);


/*
 * Textures
 */

var textureGun = PIXI.Texture.fromImage('images/square-stroke.svg'),    
	textureShapeSquare = PIXI.Texture.fromImage('images/square-fill.svg');



/*
 * Shooter
 */

// create a new Sprite using the texture
var gun = new PIXI.Sprite(textureGun);

// center the sprite's anchor point
gun.anchor.x = 0.5; 
gun.anchor.y = 0.5;

// move the sprite to the center of the screen
gun.position.x = gameWidth / 2;  
gun.position.y = gameHeight / 2;

console.log(gun.rotation);

stage.addChild(gun);

stage.interactive = true;

stage.on("mousedown", function(e){  
  shoot(gun.rotation, {
    x: gun.position.x,
    y: gun.position.y
  });
})

var bullets = [];  
var bulletSpeed = 5;

function shoot(rotation, startPosition){  
	var bullet = new PIXI.Sprite(textureShapeSquare);
	bullet.position.x = startPosition.x;
	bullet.position.y = startPosition.y;
	bullet.anchor.x = 0.5; 
	bullet.anchor.y = 0.5;
	bullet.rotation = 0;
	stage.addChild(bullet);
	bullets.push(bullet);
}

var pointAngle = 0;

function point(direction){  
	var pointAngleSteps = 0.1,
		pointAngleMin = 2,
		pointAngleMax = 4;

	pointAngle = pointAngle + (direction * pointAngleSteps);

	if (pointAngle > pointAngleMax) { pointAngle = pointAngleMax } 

	if (pointAngle < pointAngleMin) { pointAngle = pointAngleMin }



	gun.rotation = pointAngle;

	console.log(gun.rotation);
}

function rotateToPoint(mx, my, px, py){  
	var self = this;
	var dist_Y = my - py;
	var dist_X = mx - py;
	var angle = Math.atan2(dist_Y,dist_X);
	// var degrees = angle * 180/ Math.PI;
	return angle;
}

// start animating
animate();  
function animate() {  
	requestAnimationFrame(animate);

	// just for fun, let's rotate mr rabbit a little
	// gun.rotation = rotateToPoint(renderer.plugins.interaction.mouse.global.x, renderer.plugins.interaction.mouse.global.y, gun.position.x, gun.position.y);

	

	for(var b=bullets.length-1;b>=0;b--){
		// bullets[b].position.x += Math.cos(bullets[b].rotation)*bulletSpeed;
		// bullets[b].position.y += Math.sin(bullets[b].rotation)*bulletSpeed;

		bullets[b].position.x += Math.cos(bullets[b].rotation)*bulletSpeed;
		bullets[b].position.y += Math.cos(bullets[b].rotation)*bulletSpeed;
	}
	// render the container
	renderer.render(stage);
}



/*
 * Controls
 */

function keyboard(keyCode) {
	var key = {};
	key.code = keyCode;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;
	//The `downHandler`
	key.downHandler = function(event) {
		if (event.keyCode === key.code) {
			if (key.isUp && key.press) key.press();
			key.isDown = true;
			key.isUp = false;
		}
		event.preventDefault();
	};

	//The `upHandler`
	key.upHandler = function(event) {
		if (event.keyCode === key.code) {
			if (key.isDown && key.release) key.release();
			key.isDown = false;
			key.isUp = true;
		}
		event.preventDefault();
	};

	//Attach event listeners
	window.addEventListener(
		"keydown", key.downHandler.bind(key), false
	);
	window.addEventListener(
		"keyup", key.upHandler.bind(key), false
	);
	return key;
}

var leftArrow = keyboard(37),
    rightArrow = keyboard(39);

leftArrow.press = function() {
  point(-1);
};

rightArrow.press = function() {
  point(1);
};
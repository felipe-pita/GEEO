// options
var gameWidth = 300,
    gameHeight = 500,
    gameBackground = '0x323232';

// render
renderer = PIXI.autoDetectRenderer(gameWidth, gameHeight);

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
	bullet.rotation = rotation;
	stage.addChild(bullet);
	bullets.push(bullet);
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
  gun.rotation = rotateToPoint(renderer.plugins.interaction.mouse.global.x, renderer.plugins.interaction.mouse.global.y, gun.position.x, gun.position.y);

  for(var b=bullets.length-1;b>=0;b--){
    bullets[b].position.x += Math.cos(bullets[b].rotation)*bulletSpeed;
    bullets[b].position.y += Math.sin(bullets[b].rotation)*bulletSpeed;
  }
  // render the container
  renderer.render(stage);
}
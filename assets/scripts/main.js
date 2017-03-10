var game = new Phaser.Game(320, 568, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

// console.log('1');

function preload() {

	/*
	 * Sprites
	 */

	// Gun
	game.load.image('gun', 'images/bullet.square.svg');
	
	// Bullets
	game.load.image('bullet', 'images/bullet.square.svg');

	// Target
	game.load.image('target__square', 'images/target.square.svg');


	/*
	 * Audios
	 */

	// Audio
	game.load.audio('weapon__shoot', 'sounds/weapon__shoot.wav');
}

// Elements
var sprite, weapon, cursors, hitarea, targets;

// functions
var shoot, hit;

function create() {
	// init
	game.stage.backgroundColor = '#313131';
	game.physics.startSystem(Phaser.Physics.ARCADE);

	// bullets
	weapon = game.add.weapon(10, 'bullet');
	weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	weapon.bulletSpeed = 600;

	// gun
	sprite = this.add.sprite(game.width / 2, game.height - 80, 'gun');
	sprite.anchor.set(0.5);
	weapon.trackSprite(sprite, 0, 0, true);
	game.physics.arcade.enable(sprite);

	// Shoot
	hitarea = new Phaser.Rectangle(0, 0, game.width, game.height - 90);
	game.input.onDown.add(shoot);
	shootSound = game.add.audio('weapon__shoot');

	// Targets
	targets = game.add.group();
	targets.enableBody = true;
	var target = targets.create(0, 0, 'target__square');
	// target.body.gravity.y = 6;
}

function update() {
	// Rotaciona a arma se estiver dentro da hitarea
	if ( hitarea.contains(game.input.x, game.input.y) ) {
		sprite.rotation = game.physics.arcade.angleToPointer(sprite);	
	}

	game.physics.arcade.collide(weapon, targets);
	game.physics.arcade.overlap(weapon, targets, hit, null, this);
}

function render() {
	weapon.debug();
}

function shoot() {
	if (hitarea.contains(game.input.x, game.input.y)) {
		weapon.fire();
		shootSound.play();
	}

	console.log(weapon);
	console.log(targets);
}

function hit(weapon, target) {
	console.log('I M THE STRONGEST MOTHER FUCKER!!!');
	target.kill();
}
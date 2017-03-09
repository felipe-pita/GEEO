var game = new Phaser.Game(320, 568, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

console.log('1');

function preload() {
	// Sprites
	game.load.image('gun', 'images/bullet.square.svg');
	game.load.image('bullet', 'images/bullet.square.svg');

	// Audio
	game.load.audio('weapon__shoot', 'sounds/weapon__shoot.wav');
}

var sprite, weapon, cursors, fireButton;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.stage.backgroundColor = '#313131';

	weapon = game.add.weapon(10, 'bullet');
	weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	weapon.bulletSpeed = 600;

	sprite = this.add.sprite(game.width / 2, game.height - 80, 'gun');
	sprite.anchor.set(0.5);
	weapon.trackSprite(sprite, 0, 0, true);
	game.physics.arcade.enable(sprite);
	cursors = this.input.keyboard.createCursorKeys();

	/*
	 * Shoot
	 */

	hitarea = new Phaser.Rectangle(0, 0, game.width, game.height - 90);
	shootSound = game.add.audio('weapon__shoot');

	handlePointerDown = function(pointer){    
		var inside = hitarea.contains(pointer.x,pointer.y);

		if (inside) {
			weapon.fire();
			shootSound.play();
		}
	}

	game.input.onDown.add(handlePointerDown);
}

function update() {
	sprite.rotation = game.physics.arcade.angleToPointer(sprite);

	if (cursors.left.isDown) {
		sprite.body.rotation += -2;
	} else if (cursors.right.isDown) {
		sprite.body.rotation += 2;
	}
}

function render() {
	weapon.debug();
}

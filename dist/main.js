/*
 * GEEO
 * 
 */

var game = new Phaser.Game(320, 568, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	/*
	 * Sprites
	 */

	// Gun
	game.load.image('panel', 'images/bullet.square.svg');
	
	// Bullets
	game.load.image('bullet', 'images/bullet.square.svg');

	// Target
	game.load.image('target__square', 'images/target.square.svg');


	/*
	 * Audios
	 */

	// Audio
	game.load.audio('weapon__shoot', ['sounds/weapon__shoot.mp3', 'sounds/weapon__shoot.ogg']);
	game.load.audio('weapon__shoot--slow', ['sounds/weapon__shoot--slow.mp3', 'sounds/weapon__shoot--slow.ogg']);
	
	game.load.audio('target__hit', ['sounds/target__hit.mp3', 'sounds/target__hit.ogg']);
	game.load.audio('bullet__kill', ['sounds/bullet__kill.mp3', 'sounds/bullet__kill.ogg']);
}

// Elements
var weapon, panel, cursors, hitarea, targets;

// functions
var shoot, hit;

function create() {

	/*
	 * init
	 */

	// background
	game.stage.backgroundColor = '#313131';

	// Sistema de física
	game.physics.startSystem(Phaser.Physics.ARCADE);


	/*
	 * Weapon
	 */

	// Adiciona as balas
	weapon = game.add.weapon(10, 'bullet');

	// weapon.enableBody = true;

	// morrer ao sair da tela
	weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

	// velocidade
	weapon.bulletSpeed = 600;

	// angulação inicial
	game.input.x = game.world.wdth / 2;


	// hitarea
	hitarea = new Phaser.Rectangle(0, 0, game.width, game.height - 90);

	// atirar
	game.input.onDown.add(shoot);

	// peww
	shootSound = game.add.audio('weapon__shoot');
	hitSound = game.add.audio('target__hit');


	/*
	 * Panel
	 */

	// sprite
	panel = this.add.sprite(game.width / 2, game.height - 80, 'panel');
	
	// ponto de rotação
	panel.anchor.set(0.5);

	panel.rotationOffset = -90;

	// Arma deve seguir a angulação do painel
	weapon.trackSprite(panel, 0, 0, true);	

	/*
	 * Targets
	 */

	// Grupo
	targets = game.add.group();

	targets.enableBody = true;
	var tween = game.add.tween(targets).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

	for (var i = 0; i < 4; i++) {
		var target = targets.create(i * 50	, 10, 'target__square');	
	}
}

function update() {
	// Rotaciona a arma se estiver dentro da hitarea
	if ( hitarea.contains(game.input.x, game.input.y) ) {
		panel.rotation = game.physics.arcade.angleToPointer(panel);
	}

	game.physics.arcade.overlap(weapon.bullets, targets, hit, null, this);
}

function render() {
	// weapon.debug();
	//game.debug.bodyInfo(shooter, 32, 32);

    game.debug.body(weapon);
    game.debug.body(targets);
}

function shoot() {
	if (hitarea.contains(game.input.x, game.input.y)) {
		weapon.fire();
		shootSound.play();
	}
}

function hit(bullets, target) {
	console.log('I M THE STRONGEST MOTHER FUCKER IN THE WORD BITCH!!!');
	hitSound.play();
	target.kill();

}
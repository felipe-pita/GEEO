/*  _____  _____  _____  _____  */
/* |   __||   __||   __||     | */
/* |  |  ||   __||   __||  |  | */
/* |_____||_____||_____||_____| */
/*                              */

/** vamo que vamo */
const game = new Phaser.Game(320, 568, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

/** elementos */
var weapon,
	panel,
	bulletsIndicator,
	cursors,
	hitarea,
	stages,
	targets,
	control;

/** funções */
var shoot,
	hit;

/*
 * Carrega os assets
 */
function preload() {
	var assets = {
		spritesheet: {
			bullets: ['images/bullets.svg', 38, 38],
			targets: ['images/targets.svg', 38, 38],
		},
		image: {
			panel: ['images/panel.svg'],
			bulletsIndicator: ['images/bullets-indicator.svg'],
		},
		audio: {
			weaponShoot: ['sounds/weapon__shoot.mp3', 'sounds/weapon__shoot.ogg'],
			weaponShootSlow: ['sounds/weapon__shoot--slow.mp3', 'sounds/weapon__shoot--slow.ogg'],

			targetHit: ['sounds/target__hit.mp3', 'sounds/target__hit.ogg'],

			bulletKill: ['sounds/bullet__kill.mp3', 'sounds/bullet__kill.ogg'],
		}
	};
	Object.keys(assets).forEach(function(type) {
		Object.keys(assets[type]).forEach(function(id) {
			game.load[type].apply(game.load, [id].concat(assets[type][id]));
		});
	});


	// carrega o json
	loadJSON("stages.json", function(response) {
		stages = JSON.parse(response);
	});
}

/*
 * Cria o jogo
 */
function create() {

	/** init */
	game.stage.backgroundColor = '#313131';
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.input.x = game.world.wdth / 2; // angulação inicial

	/** hitarea */
	hitarea = new Phaser.Rectangle(0, 0, game.width, game.height - 90);

	/** Panel */
	panel = game.add.sprite(game.width / 2, game.height + 125, 'panel');
	panel.anchor.set((panel.height / 2) / panel.width, 0.5);
	panel.recoil = game.add.tween(panel.scale).to({ x: 1.1, y: 1.1}, 150, Phaser.Easing.Back.Out, false, 0, 0, true); // animação do tire/
	panel.angle = -90;

	/** Weapon */
	weapon = game.add.weapon(10, 'bullets');
	weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	weapon.bulletSpeed = 600;
	weapon.trackSprite(panel, 206, 0, true);
	weapon.setBulletFrames(0, 4, true);
	weapon.currentBulletFrame = 2;
	weapon.bulletFrameIndex = 1;
	weapon.shootSound = game.add.audio('weaponShoot');
	weapon.shootSound.volume = 0.4;
	weapon.hitSound = game.add.audio('targetHit');
	game.input.onDown.add(shoot);

	console.log(weapon);

	/** bullets indicator */
	bulletsIndicator = game.add.sprite(game.width / 2, game.height + 125, 'bulletsIndicator');
	bulletsIndicator.pivot.set(bulletsIndicator.width / 2, 235);

	/** Targets */
	targets = game.add.group();
	targets.enableBody = true;
	createTargets(stages.stages[0]);
	targets.x = game.world.centerX - (targets.width * 0.5);

	/** controles */
	control = {}
	control.Q = game.input.keyboard.addKey(Phaser.Keyboard.Q);
	control.W = game.input.keyboard.addKey(Phaser.Keyboard.W);
	control.E = game.input.keyboard.addKey(Phaser.Keyboard.E);
	control.R = game.input.keyboard.addKey(Phaser.Keyboard.R);
	control.T = game.input.keyboard.addKey(Phaser.Keyboard.T);
}

/*
 * Loop do jogo
 */
var once = 1;
function update() {

	/** Controles */
	if ( control.Q.isDown )
		weapon.currentBulletFrame = 0;
	else if ( control.W.isDown )
		weapon.currentBulletFrame = 1;
	else if ( control.E.isDown )
		weapon.currentBulletFrame = 2;
	else if ( control.R.isDown )
		weapon.currentBulletFrame = 3;
	else if ( control.T.isDown )
		weapon.currentBulletFrame = 4;

	weapon.bulletFrameIndex = weapon.currentBulletFrame;

	/** Rotaciona a arma se estiver dentro da hitarea */
	if ( hitarea.contains(game.input.x, game.input.y) )
		aim();

	/** Se a bala acerta o alvo */
	game.physics.arcade.overlap(weapon.bullets, targets, hit, null, this);
}

/** render do jogo */
function render() {
	// game.debug.text( "frameindex: " + weapon.bulletFrameIndex, 100, 380 );
}

/** atira */
function shoot() {

	if (hitarea.contains(game.input.x, game.input.y)) {
		weapon.fire();
		weapon.shootSound.play();
		panel.recoil.start();
	}
}

/** mira */
function aim() {
	panel.rotation = game.physics.arcade.angleToPointer(panel);
	bulletsIndicator.angle = (( panel.angle + 90 ) + 30 ) - 15 * weapon.currentBulletFrame;
}

/** acerta o alvo */
function hit(bullet, target) {
	if ( bullet.data.bulletManager.bulletFrameIndex == target.targetType ) {
		weapon.hitSound.play();
		console.log(target);
		target.die.start();
		// target.kill();
	} else {
		bullet.kill();
		console.log('errou');
	}
}

/** Cria os alvos na tela */
function createTargets(stage) {
	stage.lines.forEach((line, index) => {
		line.itemSize   = 38;
		line.itemMargin = [10, 5];

		line.height = line.itemSize;
		line.width  = (line.itemSize + (line.itemMargin[1] * 2)) * line.items.length;
		line.y      = (line.height   + (line.itemMargin[0] * 2)) * index;

		line.speed  = line.speed  || 500;
		line.easing = line.easing || Phaser.Easing.Cubic.InOut;

		for (let item of line.items) {
			item.x = (line.itemSize + (line.itemMargin[0] * 2)) * item.position;
			item.x -= line.width;

			let createdTarget = targets.create(item.x, line.y, 'targets', item.type);
			createdTarget.targetType = item.type;

			targets.animation = game.add.tween(createdTarget).to({
				x: item.x + ( line.width * 2 )
			}, line.speed, line.easing, true, 0, -1, true);

			createdTarget.die = game.add.tween(createdTarget).to({
				alpha: 0
			}, 500, 'Linear', false);
		}
	})
}


















/*
 * Helpers
 */

/** carrega arquivos json async */
function loadJSON(file, callback) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', file, false);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}

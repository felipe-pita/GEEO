/*  _____  _____  _____  _____  */
/* |   __||   __||   __||     | */
/* |  |  ||   __||   __||  |  | */
/* |_____||_____||_____||_____| */
/*                              */

/** vamo que vamo */
var game = new Phaser.Game(320, 568, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });



/** elementos */
var weapon, 
	panel, 
	cursors, 
	hitarea, 
	targets,
	shootSound,
	shootRecoil;

/** funções */
var shoot,
	hit,
	generateTargets;



/** carrega os assets */
function preload() {
	console.log('preload');
	var assets = {
		spritesheet: {
			bullets: ['images/bullets.svg', 38, 38],
			targets: ['images/targets.svg', 38, 38],
		},
		image: {
			panel: ['images/weapon.panel.svg'],
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
}



/** Cria o jogo */
function create() {
	console.log('create');

	/** init */
	game.stage.backgroundColor = '#313131';
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.input.x = game.world.wdth / 2; // angulação inicial

	/** hitarea */
	hitarea = new Phaser.Rectangle(0, 0, game.width, game.height - 90);

	/** Panel */
	panel = this.add.sprite(game.width / 2, game.height + 125, 'panel');	
	panel.anchor.set((panel.height / 2) / panel.width, 0.5);
	panelShootRecoil = game.add.tween(panel.scale).to({ x: 1.1, y: 1.1}, 150, Phaser.Easing.Back.Out, false, 0, 0, true); // animação do tiro

	/** Weapon */
	weapon = game.add.weapon(10, 'bullets');
	weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	weapon.bulletSpeed = 600;
	weapon.trackSprite(panel, 200, 0, true);
	weapon.setBulletFrames(0, 4, true);
	game.input.onDown.add(shoot); // atirar
	shootSound = game.add.audio('weaponShoot'); // som do tiro
	shootSound.volume = 0.4; // volume
	hitSound = game.add.audio('targetHit'); // som de acerto

	/** Targets */
	targets = game.add.group();
	targets.enableBody = true;

	// pega os stages no json
	loadJSON("stages.json", function(response) {
		var stages = JSON.parse(response);
		generateTargets(stages.stages[0]);
	});

	// targets.x = game.world.centerX - (targets.width * 0.5);
}

var once = 1;
/** loop do jogo */
function update() {

	/** Rotaciona a arma se estiver dentro da hitarea */
	if ( hitarea.contains(game.input.x, game.input.y) )
		panel.rotation = game.physics.arcade.angleToPointer(panel);

	game.physics.arcade.overlap(weapon.bullets, targets, hit, null, this);
	// weapon.bulletFrameIndex = 3;
}



/** render do jogo */
function render() {
	// weapon.debug();
	// game.debug.spriteInfo('targets', 32, 32);
}



/** Cria os alvos na tela */
function generateTargets(stage) {
	console.log('generate');
	var speed, easing;

	for (var a = 0; a < stage.lines.length; a++) {
		var line = stage.lines[a];

		speed = (line.speed != null) ? line.speed : 500;
		easing = (line.easing != null) ? line.easing : 'Quart.easeInOut';

		var lineGroup = game.add.group();

		for (var b = 0; b < line.items.length; b++) {
			var item = line.items[b];

			var itemGroup = lineGroup.create(item.position * 10, (80 * a) + 30, 'targets', item.type);
		}

		// targetsAnimation = game.add.tween(lineGroup).to({ x: 200 }, speed, easing, true, 0, -1, true);

		targets.add(lineGroup);
	}
}



/** atira */
function shoot() {
	if (hitarea.contains(game.input.x, game.input.y)) {

		// atira
		weapon.fire();

		// faz pewwww
		shootSound.play();

		// Anima o tiro
		panelShootRecoil.start();
	}
}



/** acerta o alvo */
function hit(bullets, target) {
	hitSound.play();
	target.kill();
}



/** carrega arquivos json async */
function loadJSON(file, callback) {   
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', file, true);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	};
	xobj.send(null);  
}


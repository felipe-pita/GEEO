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
	stages,
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


	// carrega o json
	loadJSON("stages.json", function(response) {
		stages = JSON.parse(response);
	});
}



/** Cria o jogo */
function create() {
	

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
	generateTargets(stages.stages[0]);

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

	for (var a = 0; a < stage.lines.length; a++) {
		var generateLine = stage.lines[a],
		    generateLineSpeed = (generateLine.speed != null) ? generateLine.speed : 500,
		    generateLineEasing = (generateLine.easing != null) ? generateLine.easing : Phaser.Easing.Cubic.InOut;

		for (var b = 0; b < generateLine.items.length; b++) {
			var generateItem = generateLine.items[b],
			    generateItemX = (generateItem.position * 60) - (game.width / 2),
			    generateItemY = (80 * a) + 30;

			    console.log(game.width / 2);

			var generateItemSprite = targets.create(generateItemX, generateItemY, 'targets', generateItem.type);

			targetsAnimation = game.add.tween(generateItemSprite).to({ x: generateItemX + (game.width) }, generateLineSpeed, generateLineEasing, true, 0, -1, true);
		}
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
	xobj.open('GET', file, false);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	};
	xobj.send(null);  
}


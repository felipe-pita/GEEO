/*
 _____  _____  _____  _____ 
|   __||   __||   __||     |
|  |  ||   __||   __||  |  |
|_____||_____||_____||_____|

*/

var game = new Phaser.Game(320, 568, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

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

// Elements
var weapon, 
	panel, 
	cursors, 
	hitarea, 
	targets,
	shootSound,
	shootRecoil;

// functions
var shoot,
	hit,
	generateTargets;

function create() {

	/*
	 * init
	 */

	game.stage.backgroundColor = '#313131';
	game.physics.startSystem(Phaser.Physics.ARCADE);
	// angulação inicial
	game.input.x = game.world.wdth / 2;

	/*
	 * Panel
	 */

	panel = this.add.sprite(game.width / 2, game.height + 125, 'panel');	
	panel.anchor.set((panel.height / 2) / panel.width, 0.5);

	// animação do tiro
	panelShootRecoil = game.add.tween(panel.scale).to({ x: 1.1, y: 1.1}, 150, Phaser.Easing.Back.Out, false, 0, 0, true);

	/*
	 * Weapon
	 */

	weapon = game.add.weapon(10, 'bullets');
	weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	weapon.bulletSpeed = 600;
	weapon.trackSprite(panel, 200, 0, true);

	weapon.setBulletFrames(0, 4, true);


	// hitarea
	hitarea = new Phaser.Rectangle(0, 0, game.width, game.height - 90);

	// atirar
	game.input.onDown.add(shoot);

	// peww
	shootSound = game.add.audio('weaponShoot');
	shootSound.volume = 0.4;

	// hit
	hitSound = game.add.audio('targetHit');

	/*
	 * Targets
	 */

	// Grupo
	targets = game.add.group();
	targets.enableBody = true;

	targetsLoad = loadJSON('stages.json');

	console.log(targetsLoad);

	// generateTargets();

	targets.x = game.world.centerX - (targets.width * 0.5);
}

function update() {
	// Rotaciona a arma se estiver dentro da hitarea
	if ( hitarea.contains(game.input.x, game.input.y) ) {
		panel.rotation = game.physics.arcade.angleToPointer(panel);
	}

	game.physics.arcade.overlap(weapon.bullets, targets, hit, null, this);


	// weapon.bulletFrameIndex = 3;
}

function render() {
	// weapon.debug();
	// game.debug.spriteInfo('targets', 32, 32);
}

function generateTargets(line) {
	speed = (speed != null) ? speed : 500;
	easing = (easing != null) ? easing : 'Quart.easeInOut';

	var line = game.add.group();

	for (var i = 0; i < itens.length; i++) {
		console.log(itens[i]);
		var item = line.create(itens[i].pos * 60, (80 * line) + 30, 'targets', itens[i].type);
	}

	targetsAnimation = game.add.tween(line).to({ x: 200 }, speed, easing, true, 0, -1, true);

	targets.add(line);
}

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

function hit(bullets, target) {
	hitSound.play();
	target.kill();
}


function loadJSON(file) {
	var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");

	xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			// return JSON.parse(xobj.responseText);
			return 'aeeeeooo';

			console.log('teste');
		}
	};
	xobj.send(null);

	console.log(xobj.responseText);
}

loadJSON('stages.json');



// parei tentando ler o json, ja tinha dado certo, olhando aqui
// https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
// mas eu quis mudar tudo pq né
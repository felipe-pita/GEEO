// options
var gameWidth = 320,
	gameHeight = 568,
	gameBackground = '0x323232';

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('ship', 'images/bullet.square.svg');
    game.load.image('bullet', 'images/bullet.square.svg');
}

var sprite;
var weapon;
var cursors;
var fireButton;

function create() {

    //  Creates 30 bullets, using the 'bullet' graphic
    weapon = game.add.weapon(30, 'bullet');

    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  Because our bullet is drawn facing up, we need to offset its rotation:
    weapon.bulletAngleOffset = 0;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 400;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 60;

    sprite = this.add.sprite(150, 150, 'ship');

    game.physics.arcade.enable(sprite);

    //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    weapon.trackSprite(sprite, 14, 0);

    cursors = this.input.keyboard.createCursorKeys();

    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

}

function update() {

     sprite.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -200;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 200;
    }

    if (fireButton.isDown)
    {
        weapon.fire();
    }

}

function render() {
    weapon.debug();
}

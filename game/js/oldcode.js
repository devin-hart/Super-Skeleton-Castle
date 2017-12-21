// NES Res 256, 240

var game = new Phaser.Game(256, 240,  Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

game.state.add('game', game);

function preload() {

// Tilemaps
  game.load.tilemap('level1', 'assets/levels/level1_map_final.json', null, Phaser.Tilemap.TILED_JSON);

// Images
  game.load.image('simples_pimples', 'assets/images/simples_pimples.png');
  game.load.image('paper', 'assets/images/paper.png');
  game.load.image('spike', 'assets/images/spike.png');
  game.load.image('background', 'assets/images/cityscape.png');

// Spritesheets
  game.load.spritesheet('dude', 'assets/images/SP_player_spritesheet.png', 16, 16);
  game.load.spritesheet('bat', 'assets/images/bat.png', 16, 16);

// Audio
  game.load.audio('music', 'assets/audio/music.mp3');
  game.load.audio('jump', 'assets/audio/jump.wav');

}

// Level vars
var map;
var tileset;
var layer;
var bg;

// Player vars
var player;
var controls;
var jumpButton;

// Enemy vars
var enemy;
var spike;
var bat;

// SFX vars
var music;
var jumpSound;

// Collectible vars
var papers;
var score = 0;
var scoreText;


function create() {

  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.stage.backgroundColor = '#000000';
  // bg = game.add.tileSprite(0, 0, 1000, 600, 'background');
  // bg.fixedToCamera = true;

  map = game.add.tilemap('level1');

  map.addTilesetImage('simples_pimples');

  // map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

  layer = map.createLayer('Tile Layer 1');
  map.setCollisionByExclusion([0]);
  //  Un-comment this on to see the collision tiles
  // layer.debug = true;

  layer.resizeWorld();

  // The player and its settings
  player = game.add.sprite(32, game.world.height - 150, 'dude');

  bat = game.add.sprite(48, game.world.height - 100, 'bat');

  //  We need to enable physics on the player
  game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
  game.physics.arcade.enable(bat, Phaser.Physics.ARCADE);

  // Removes bat if out of world bounds
  bat.checkWorldBounds = true;
  bat.outOfBoundsKill = true;

  bat.body.velocity.x = -10;


  //  Player physics properties.
  player.body.bounce.y = 0.1;
  player.body.gravity.y = 1250;
  player.body.gravity.y = 1500;
  // player.body.collideWorldBounds = true;

  //  Our two animations, walking left and right.
  player.animations.add('left', [0, 1], 10, true);
  player.animations.add('right', [4, 5], 10, true);

  bat.animations.add('fly-left', [0, 1], 5, true);
  bat.animations.add('right', [2, 3], 10, true);
  bat.play('fly-left');
  bat.body.moves = false;

  bat.enableBody = true;

  // bat.body.gravity.y = 300;

  game.camera.follow(player);

  // Spikes
  spike = [game.add.sprite(416, 112, 'spike'),
          game.add.sprite(432, 112, 'spike'),
          game.add.sprite(448, 112, 'spike'),
          game.add.sprite(480, 112, 'spike'),
          game.add.sprite(496, 112, 'spike'),
          game.add.sprite(528, 112, 'spike'),
          game.add.sprite(544, 112, 'spike')];

  spike.enablebody = true;
  game.physics.arcade.enable(spike, Phaser.Physics.ARCADE);

  //  Finally some papers to collect
  papers = game.add.group();

  //  We will enable physics for any paper that is created in this group
  papers.enableBody = true;

  //  Here we'll create 12 of them evenly spaced apart
  for (var i = 0; i < 10; i++) {
    //  Create a paper inside of the 'papers' group
    var paper = papers.create(i * 70, 0, 'paper');

    //  Let gravity do its thing
    paper.body.gravity.y = 300;

    //  This just gives each paper a slightly random bounce value
    paper.body.bounce.y = 0.3 + Math.random() * 0.2;
  }

  //  The score
  scoreText = game.add.text(8, 8, 'Papers Collected: 0/10', {
    fontSize: '12px',
    fill: '#FFFFFF'
  });

  scoreText.fixedToCamera = true;

  //  Our controls.
  controls = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  // Audio
  music = game.add.audio('music');
  music.play();
  music.loopFull();

  jumpSound = game.add.audio('jump');

  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

  game.input.onDown.add(gofull);
}

function update() {

  //  Collide the player and the papers with the platforms
  game.physics.arcade.collide(player, layer);
  game.physics.arcade.collide(papers, layer);
  game.physics.arcade.collide(bat, layer);

  //  Checks to see if the player overlaps with any of the papers, if he does call the collectPaper function
  game.physics.arcade.overlap(player, papers, collectPaper, null, this);
  game.physics.arcade.overlap(player, spike, playerDie, null, this);
  // game.physics.arcade.overlap(player, bat, playerDie, null, this);

  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;

  if (controls.left.isDown) {
    //  Move to the left
    player.body.velocity.x = -100;

    player.animations.play('left');
  } else if (controls.right.isDown) {
    //  Move to the right
    player.body.velocity.x = 100;

    player.animations.play('right');
  } else {
    //  Stand still
    player.animations.stop();

    // player.frame = 3;
  }

  //  Allow the player to jump if they are touching the ground.
  if (jumpButton.isDown && player.body.onFloor()) {
    player.body.velocity.y = -350;
    jumpSound.play();

  }

  if (!player.inWorld) {
    playerDie();
}

}

function render() {

    // Sprite debug info
    // game.debug.spriteInfo(player, 32, 32);

}

function collectPaper(player, paper) {

  // Removes the paper from the screen
  paper.kill();

  //  Add and update the score
  score += 1;
  scoreText.text = 'Papers Collected: ' + score + '/10';

  if (score === 10) {
    scoreText.text = "You win!"
  };

}

function gofull() {

    if (game.scale.isFullScreen)
    {
        game.scale.stopFullScreen();
    }
    else
    {
        game.scale.startFullScreen(false);
    }

}

function playerDie() {
  score = 0;
  music.stop();
  game.state.start(game.state.current);


}

var menuState = {

  create: function() {

    var nameLabel = game.add.text(80, 80, 'Game', {
      font: '50px Arial',
      fill: '#FFFFFF'
    });

    var startLabel = game.add.text(80, game.world.height - 80, 'Press X to begin', {
      font: '25px Arial',
      fill: '#FFFFFF'
    });

    var xKey = game.input.keyboard.addKey(Phaser.Keyboard.X);

    xKey.onDown.addOnce(this.start, this);

  },

  start: function () {

    game.state.start('play');

  },

};

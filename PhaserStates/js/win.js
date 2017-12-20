var winState = {

  create: function() {

    var winLabel = game.add.text(80, 80, 'YOU WON!', {
      font: '50px Arial',
      fill: '#00FF00'
    });

    var startLabel = game.add.text(80, game.world.height - 80, 'Press the X key to restart', {
      font: '25px Arial',
      fill: '#FFFFFF'
    });

    var xKey = game.input.keyboard.addKey(Phaser.Keyboard.X);

    xKey.onDown.addOnce(this.restart, this);
  },

  restart: function() {
    game.state.start('menu');
  },

};

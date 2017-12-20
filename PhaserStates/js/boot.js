var bootState = {

  create: function () {

    // Loads Arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Loads 'load' state
    game.state.start('load');
  }
}

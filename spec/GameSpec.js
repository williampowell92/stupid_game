describe('Game', () => {
  let canvas;
  let context;
  let game;
  let gameFactory;
  let collision;
  let collisionFactory;
  let gameSize;
  let platform;
  let platforms;
  let player;

  beforeEach(() => {
    canvas = { width: 800, height: 800 };
    context = { clearRect() {} };
    gameSize = { x: canvas.width, y: canvas.height };
    player = { draw() {}, update() {} };
    platform = { draw() {}, update() {} };
    platforms = [platform];
    collisionFactory = new CollisionFactory();
    collision = jasmine.createSpyObj('collision', ['resolveCollisions']);
    spyOn(collisionFactory, 'build').and.returnValue(collision);
    gameFactory = new GameFactory();
    game = gameFactory.build(player, platforms, collisionFactory);
  });

  describe('initialize', () => {
    it('creates a bodies array containing player', () => {
      expect(game.bodies).toContain(player);
    });

    it('creates a bodies array containing platform', () => {
      expect(game.bodies).toContain(platform);
    });
  });

  describe('Draw', () => {
    beforeEach(() => {
      spyOn(context, 'clearRect');
      spyOn(player, 'draw');
    });

    it('clears the canvas', () => {
      game.draw(context, gameSize);
      expect(context.clearRect).toHaveBeenCalledWith(0, 0, gameSize.x, gameSize.y);
    });

    it('draws all the bodies from array', () => {
      game.bodies = [player];
      game.draw(context, gameSize);
      expect(player.draw).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    it('update the screen with bodies', () => {
      spyOn(player, 'update');
      game.bodies = [player];
      game.update(gameSize);
      expect(player.update).toHaveBeenCalled();
    });

    it('calls resolveCollisions', () => {
      game.update(gameSize);
      expect(collision.resolveCollisions).toHaveBeenCalled();
    });
  });
});

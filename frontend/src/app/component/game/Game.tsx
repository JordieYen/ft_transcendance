import { faL } from "@fortawesome/free-solid-svg-icons";
import Matter from "matter-js";

const Game = () => {
  const ballSpeed = 12;

  const engine = Matter.Engine.create();
  const runner = Matter.Runner.create();
  const world = engine.world;

  const render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 2045,
      height: 900,
      showAngleIndicator: true,
    },
  });

  const canvas = render.canvas;
  canvas.style.cursor = "none";
  engine.gravity.y = 0;

  Matter.Render.run(render);
  Matter.Runner.run(runner, engine);

  const topBorder = Matter.Bodies.rectangle(1025, -25, 2045, 50, {
    isStatic: true,
  });

  const botBorder = Matter.Bodies.rectangle(1025, 925, 2045, 50, {
    isStatic: true,
  });

  let leftPaddle = Matter.Bodies.rectangle(30, 450, 25, 150, {
    isStatic: true,
  });

  const rightPaddle = Matter.Bodies.rectangle(2015, 450, 25, 150, {
    isStatic: true,
  });

  const mouse = Matter.Mouse.create(render.canvas);
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      render: {
        visible: false,
      },
    },
  });

  const ball = Matter.Bodies.circle(1022, 450, 20, {
    density: 0.001,
    mass: 0,
    restitution: 1,
    friction: 0,
    frictionAir: 0,
  });
  Matter.Body.setVelocity(ball, { x: ballSpeed, y: ballSpeed });

  Matter.Composite.add(engine.world, [
    topBorder,
    botBorder,
    leftPaddle,
    rightPaddle,
    mouseConstraint,
    ball,
  ]);

  const keyState = {
    " ": false,
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    keyState[event.key] = true;
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    keyState[event.key] = false;
  };

  Matter.Events.on(engine, "beforeUpdate", function () {
    if (mouse.position.y < 75) mouse.position.y = 75;
    if (mouse.position.y > 825) mouse.position.y = 825;
    Matter.Body.setPosition(leftPaddle, {
      x: leftPaddle.position.x,
      y: mouse.position.y,
    });
    Matter.Body.setPosition(rightPaddle, {
      x: rightPaddle.position.x,
      y: mouse.position.y,
    });
    if (ball.position.y < 0 || ball.position.y > render.canvas.height) {
      Matter.Body.setPosition(ball, { x: 1022, y: 450 });
      Matter.Body.setVelocity(ball, { x: ballSpeed, y: ballSpeed });
    }
    if (keyState[" "]) {
      const vertices = [
        { x: 0, y: 0 },
        { x: 200, y: 0 },
        { x: 200, y: 50 },
        { x: 0, y: 50 },
      ];
      const paddle = Matter.Bodies.fromVertices(
        leftPaddle.position.x,
        leftPaddle.position.y,
        vertices,
        {
          isStatic: true,
        },
      );
      Matter.World.remove(world, leftPaddle);
      Matter.World.add(world, paddle);
      leftPaddle = paddle;
    }
    if (!keyState[" "]) {
      const paddle = Matter.Bodies.rectangle(
        leftPaddle.position.x,
        leftPaddle.position.y,
        25,
        150,
        {
          isStatic: true,
        },
      );
      Matter.World.remove(world, leftPaddle);
      Matter.World.add(world, paddle);
      leftPaddle = paddle;
    }
  });

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
};

export default Game;

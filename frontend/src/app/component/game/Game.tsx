import { SocketContext } from "@/app/socket/SocketProvider";
import Matter, { Vector } from "matter-js";
import { useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface KeyType {
  key: string;
  keyPressDown: boolean;
  pressDuration: number;
}

const screenWidth = 2045;
const screenHeight = 900;

const borderWidth = screenWidth;
const borderHeight = 20;

const paddleWidth = 25;
const paddleHeight = 150;

const leftPaddlePos: Vector = {
  x: paddleWidth * 2,
  y: screenHeight / 2,
};

const rightPaddlePos: Vector = {
  x: screenWidth - paddleWidth * 2,
  y: screenHeight / 2,
};

const ballSpeed: Vector = { x: 10, y: 10 };
const smashSpeed: Vector = { x: 40, y: 10 };

const maxTimeFrame = 5;
const perfectHitZone = 50;
const perfectHitDuration = 2;

const Game = () => {
  const socket = useContext(SocketContext);
  // const socket = io("http://localhost:3000");

  useEffect(() => {
    if (socket) {
      socket?.emit("game-room", 1);
    }
  }, [socket]);

  /* initialize engine and render */
  const engine = Matter.Engine.create();
  const runner = Matter.Runner.create();
  const world = engine.world;

  const render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: screenWidth,
      height: screenHeight,
      showAngleIndicator: true,
    },
  });

  engine.gravity.y = 0;
  const canvas = render.canvas;
  canvas.style.cursor = "none";
  const keyArr: { [key: string]: KeyType } = {};

  Matter.Render.run(render);
  Matter.Runner.run(runner, engine);

  /* create objects */
  const topBorder = Matter.Bodies.rectangle(
    borderWidth / 2,
    0 - borderHeight / 2,
    borderWidth,
    borderHeight,
    { isStatic: true },
  );

  const botBorder = Matter.Bodies.rectangle(
    borderWidth / 2,
    screenHeight + borderHeight / 2,
    borderWidth,
    borderHeight,
    { isStatic: true },
  );

  let leftPaddle = Matter.Bodies.rectangle(
    leftPaddlePos.x,
    leftPaddlePos.y,
    paddleWidth,
    paddleHeight,
    { isStatic: true },
  );

  let rightPaddle = Matter.Bodies.rectangle(
    rightPaddlePos.x,
    rightPaddlePos.y,
    paddleWidth,
    paddleHeight,
    { isStatic: true },
  );

  const ball = Matter.Bodies.circle(1022, 450, 20, {
    density: 0.001,
    mass: 0,
    restitution: 1,
    friction: 0,
    frictionAir: 0,
  });
  Matter.Body.setVelocity(ball, { x: ballSpeed.x, y: ballSpeed.y });

  /* enable mouse movement */
  const mouse = Matter.Mouse.create(render.canvas);
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      render: {
        visible: false,
      },
    },
  });

  /* add all objects into world */
  Matter.Composite.add(engine.world, [
    topBorder,
    botBorder,
    leftPaddle,
    rightPaddle,
    ball,
    mouseConstraint,
  ]);

  /* handle key press */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!(event.key in keyArr)) {
      keyArr[event.key] = {
        key: event.key,
        keyPressDown: true,
        pressDuration: 0,
      };
    }
    keyArr[event.key].keyPressDown = true;
    if (event.key === " " && keyArr[event.key].pressDuration <= maxTimeFrame)
      keyArr[event.key].pressDuration += 1;
    console.log("keydown ", keyArr[event.key]);
  };

  /* handle key release */
  const handleKeyUp = (event: KeyboardEvent) => {
    keyArr[event.key].keyPressDown = false;
    keyArr[event.key].pressDuration = 0;
    console.log("keyup ", keyArr[event.key]);
  };

  Matter.Events.on(engine, "beforeUpdate", function () {
    /* automate right paddle */
    rightPaddlePos.y = ball.position.y;

    /* set both paddle to not go out of bounds */
    if (mouse.position.y < paddleHeight / 2)
      mouse.position.y = paddleHeight / 2;
    if (mouse.position.y > screenHeight - paddleHeight / 2)
      mouse.position.y = screenHeight - paddleHeight / 2;
    if (rightPaddlePos.y < paddleHeight / 2)
      rightPaddlePos.y = paddleHeight / 2;
    if (rightPaddlePos.y > screenHeight - paddleHeight / 2)
      rightPaddlePos.y = screenHeight - paddleHeight / 2;

    /* set left paddle position to follow mouse movement */
    Matter.Body.setPosition(leftPaddle, {
      x: leftPaddlePos.x,
      y: mouse.position.y,
    });

    /* set right paddle position to follow ball position */
    Matter.Body.setPosition(rightPaddle, {
      x: rightPaddlePos.x,
      y: rightPaddlePos.y,
    });

    /* reset ball position when ball goes out of bounds */
    if (ball.position.y < 0 || ball.position.y > render.canvas.height) {
      Matter.Body.setPosition(ball, {
        x: screenWidth / 2,
        y: screenHeight / 2,
      });
      Matter.Body.setVelocity(ball, { x: ballSpeed.x, y: ballSpeed.y });
    }

    /* handle perfect timing and move left paddle position when key press */
    if (" " in keyArr && keyArr[" "].keyPressDown) {
      // set perfect hit timeframe
      if (
        keyArr[" "].pressDuration >= 1 &&
        keyArr[" "].pressDuration <= perfectHitDuration
      ) {
        if (
          ball.position.x > leftPaddle.position.x &&
          ball.position.x <= leftPaddle.position.x + perfectHitZone &&
          ball.position.y >= leftPaddle.position.y - perfectHitZone &&
          ball.position.y <= leftPaddle.position.y + perfectHitZone
        ) {
          Matter.Body.setVelocity(ball, {
            x: ball.speed * 1.5,
            y: smashSpeed.y,
          });
        }
      }

      /* move left paddle position backwards */
      const paddle = Matter.Bodies.rectangle(
        leftPaddlePos.x - 15,
        leftPaddle.position.y,
        paddleWidth,
        paddleHeight,
        {
          isStatic: true,
          density: 0.1,
          friction: 0.2,
          restitution: 0.8,
        },
      );
      Matter.World.remove(world, leftPaddle);
      Matter.World.add(world, paddle);
      leftPaddle = paddle;
    }

    /* reset left paddle position to default on key release */
    if (" " in keyArr && !keyArr[" "].keyPressDown) {
      const paddle = Matter.Bodies.rectangle(
        leftPaddlePos.x,
        leftPaddle.position.y,
        paddleWidth,
        paddleHeight,
        { isStatic: true },
      );
      Matter.World.remove(world, leftPaddle);
      Matter.World.add(world, paddle);
      leftPaddle = paddle;
    }
  });

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return null;
};

export default Game;

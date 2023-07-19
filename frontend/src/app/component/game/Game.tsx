import { SocketContext } from "@/app/socket/SocketProvider";
import Matter, { Engine, Vector } from "matter-js";
import { useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useGameData } from "./GameContext";

interface KeyType {
  key: string;
  keyPressDown: boolean;
  pressDuration: number;
}

interface Ball {
  speed: Vector;
  maxTimeFrame: number;
  perfectHitZone: number;
  perfectHitDuration: number;
}

interface Paddle {
  width: number;
  height: number;
  position: Vector;
}

interface GameElements {
  screen: Vector;
  border: Vector;
  ball: Ball;
  leftPaddle: Paddle;
  rightPaddle: Paddle;
}

const screenWidth = 2045;
const screenHeight = 900;

const borderWidth = screenWidth;
const borderHeight = 20;

const paddleWidth = 25;
const paddleHeight = 150;

const gameProperties: GameElements = {
  screen: { x: screenWidth, y: screenHeight },
  border: { x: borderWidth, y: borderHeight },
  leftPaddle: {
    width: paddleWidth,
    height: paddleHeight,
    position: { x: paddleWidth * 2, y: screenHeight / 2 },
  },
  ball: {
    speed: { x: 10, y: 10 },
    maxTimeFrame: 5,
    perfectHitZone: 50,
    perfectHitDuration: 2,
  },
  rightPaddle: {
    width: paddleWidth,
    height: paddleHeight,
    position: { x: screenWidth - paddleWidth * 2, y: screenHeight / 2 },
  },
};

const Game = () => {
  const { gameState } = useGameData();
  console.log("gameState", gameState);
  const socket = useContext(SocketContext);
  // const socket = io("http://localhost:3000");

  useEffect(() => {
    if (socket) {
      socket?.emit("game-room", 1);
      socket?.emit("initialize-game", gameProperties);

      // socket?.on("emit-engine", (test: any) => {
      //   console.log(test);
      // });
    }

    /* initialize engine and render */
    const engine = Matter.Engine.create();
    const runner = Matter.Runner.create();

    const render = Matter.Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: gameProperties.screen.x,
        height: gameProperties.screen.y,
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
      gameProperties.border.x / 2,
      0 - gameProperties.border.y / 2,
      gameProperties.border.x,
      gameProperties.border.y,
      { isStatic: true },
    );

    const botBorder = Matter.Bodies.rectangle(
      gameProperties.border.x / 2,
      gameProperties.screen.y + gameProperties.border.y / 2,
      gameProperties.border.x,
      gameProperties.border.y,
      { isStatic: true },
    );

    let leftPaddle = Matter.Bodies.rectangle(
      gameProperties.leftPaddle.position.x,
      gameProperties.leftPaddle.position.y,
      gameProperties.leftPaddle.width,
      gameProperties.leftPaddle.height,
      { isStatic: true },
    );

    let rightPaddle = Matter.Bodies.rectangle(
      gameProperties.rightPaddle.position.x,
      gameProperties.rightPaddle.position.y,
      gameProperties.rightPaddle.width,
      gameProperties.rightPaddle.height,
      { isStatic: true },
    );

    const ball = Matter.Bodies.circle(1022, 450, 20, {
      density: 0.001,
      mass: 0,
      restitution: 1,
      friction: 0,
      frictionAir: 0,
    });
    Matter.Body.setVelocity(ball, {
      x: gameProperties.ball.speed.x,
      y: gameProperties.ball.speed.y,
    });

    /* enable mouse movement */
    const mouse = Matter.Mouse.create(render.canvas);

    /* add all objects into world */
    Matter.Composite.add(engine.world, [
      topBorder,
      botBorder,
      leftPaddle,
      rightPaddle,
      ball,
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
      if (
        event.key === " " &&
        keyArr[event.key].pressDuration <= gameProperties.ball.maxTimeFrame
      )
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
      gameProperties.rightPaddle.position.y = ball.position.y;

      /* set both paddle to not go out of bounds */
      if (mouse.position.y < gameProperties.leftPaddle.height / 2)
        mouse.position.y = gameProperties.leftPaddle.height / 2;
      if (
        mouse.position.y >
        gameProperties.screen.y - gameProperties.leftPaddle.height / 2
      )
        mouse.position.y =
          gameProperties.screen.y - gameProperties.leftPaddle.height / 2;
      if (
        gameProperties.rightPaddle.position.y <
        gameProperties.leftPaddle.height / 2
      )
        gameProperties.rightPaddle.position.y =
          gameProperties.leftPaddle.height / 2;
      if (
        gameProperties.rightPaddle.position.y >
        gameProperties.screen.y - gameProperties.leftPaddle.height / 2
      )
        gameProperties.rightPaddle.position.y =
          gameProperties.screen.y - gameProperties.leftPaddle.height / 2;

      /* set left paddle position to follow mouse movement */
      Matter.Body.setPosition(leftPaddle, {
        x: gameProperties.leftPaddle.position.x,
        y: mouse.position.y,
      });

      /* set right paddle position to follow ball position */
      Matter.Body.setPosition(rightPaddle, {
        x: gameProperties.rightPaddle.position.x,
        y: gameProperties.rightPaddle.position.y,
      });

      /* reset ball position when ball goes out of bounds */
      if (ball.position.y < 0 || ball.position.y > render.canvas.height) {
        Matter.Body.setPosition(ball, {
          x: gameProperties.screen.x / 2,
          y: gameProperties.screen.y / 2,
        });
        Matter.Body.setVelocity(ball, {
          x: gameProperties.ball.speed.x,
          y: gameProperties.ball.speed.y,
        });
      }

      /* handle perfect timing and move left paddle position when key press */
      if (" " in keyArr && keyArr[" "].keyPressDown) {
        // set perfect hit timeframe
        if (
          keyArr[" "].pressDuration >= 1 &&
          keyArr[" "].pressDuration <= gameProperties.ball.perfectHitDuration
        ) {
          if (
            ball.position.x > leftPaddle.position.x &&
            ball.position.x <=
              leftPaddle.position.x + gameProperties.ball.perfectHitZone &&
            ball.position.y >=
              leftPaddle.position.y - gameProperties.ball.perfectHitZone &&
            ball.position.y <=
              leftPaddle.position.y + gameProperties.ball.perfectHitZone
          ) {
            Matter.Body.setVelocity(ball, {
              x: ball.speed * 1.5,
              y: gameProperties.ball.speed.y,
            });
          }
        }

        /* move left paddle position backwards */
        const paddle = Matter.Bodies.rectangle(
          gameProperties.leftPaddle.position.x - 15,
          leftPaddle.position.y,
          gameProperties.leftPaddle.width,
          gameProperties.leftPaddle.height,
          {
            isStatic: true,
            density: 0.1,
            friction: 0.2,
            restitution: 0.8,
          },
        );
        Matter.World.remove(engine.world, leftPaddle);
        Matter.World.add(engine.world, paddle);
        leftPaddle = paddle;
      }

      /* reset left paddle position to default on key release */
      if (" " in keyArr && !keyArr[" "].keyPressDown) {
        const paddle = Matter.Bodies.rectangle(
          gameProperties.leftPaddle.position.x,
          leftPaddle.position.y,
          gameProperties.leftPaddle.width,
          gameProperties.leftPaddle.height,
          { isStatic: true },
        );
        Matter.World.remove(engine.world, leftPaddle);
        Matter.World.add(engine.world, paddle);
        leftPaddle = paddle;
      }
    });

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  }, [socket]);
  return null;
};

export default Game;

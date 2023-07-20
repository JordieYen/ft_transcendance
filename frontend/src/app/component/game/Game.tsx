import { SocketContext } from "@/app/socket/SocketProvider";
import Matter, { Vector } from "matter-js";
import { useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useGameData } from "./GameContext";

interface KeyType {
  key: string;
  keyPressDown: boolean;
  pressDuration: number;
}

interface Ball {
  position: Vector;
  radius: number;
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
    position: { x: screenWidth / 2, y: screenHeight / 2 },
    radius: 20,
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

const initializeGame = () => {
  /* initialize engine and render */
  const engine = Matter.Engine.create();
  const runner = Matter.Runner.create();

  engine.gravity.y = 0;
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

  const ball = Matter.Bodies.circle(
    gameProperties.ball.position.x,
    gameProperties.ball.position.y,
    gameProperties.ball.radius,
    {
      restitution: 1,
      friction: 0,
      frictionAir: 0,
    },
  );

  /* add all objects into world */
  Matter.Composite.add(engine.world, [
    topBorder,
    botBorder,
    leftPaddle,
    rightPaddle,
    ball,
  ]);

  return { engine, leftPaddle, rightPaddle, ball };
};

const Game = () => {
  const gameState = useGameData().gameState;
  console.log("gameState", gameState);

  const roomId = gameState?.roomId;
  const playerOneId = gameState?.player1User.id;
  const playerTwoId = gameState?.player2User.id;

  const socket = useContext(SocketContext);
  // const socket = io("http://localhost:3000");

  useEffect(() => {
    if (socket) {
      socket?.emit("game-room", 1);
      socket?.emit("initialize-game", gameProperties);
    }

    const keyArr: { [key: string]: KeyType } = {};
    let { engine, leftPaddle, rightPaddle, ball } = initializeGame();
    const render = Matter.Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: gameProperties.screen.x,
        height: gameProperties.screen.y,
        showAngleIndicator: true,
      },
    });

    const canvas = render.canvas;
    canvas.style.cursor = "none";
    Matter.Render.run(render);

    /* enable mouse movement */
    const mouse = Matter.Mouse.create(render.canvas);

    /* handle key down */
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

      if (event.key === "s")
        socket?.emit("start-game", {
          room: roomId,
          gameProperties: gameProperties,
        });
    };

    /* handle key up */
    const handleKeyUp = (event: KeyboardEvent) => {
      keyArr[event.key].keyPressDown = false;
      keyArr[event.key].pressDuration = 0;
      console.log("keyup ", keyArr[event.key]);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    if (socket) {
      socket?.on("ballSpeed", (ballSpeed: Vector) => {
        Matter.Body.setVelocity(ball, {
          x: ballSpeed.x,
          y: ballSpeed.y,
        });
      });

      socket?.on("ballPosition", (ballPos: Vector) => {
        Matter.Body.setPosition(ball, {
          x: ballPos.x,
          y: ballPos.y,
        });
      });

      socket?.on("leftPaddlePosition", (paddlePos: Vector) => {
        Matter.Body.setPosition(leftPaddle, {
          x: paddlePos.x,
          y: paddlePos.y,
        });
      });

      socket?.on("rightPaddlePosition", (paddlePos: Vector) => {
        Matter.Body.setPosition(rightPaddle, {
          x: paddlePos.x,
          y: paddlePos.y,
        });
      });
    }
  }, [socket, roomId]);

  // Matter.Events.on(engine, "beforeUpdate", function () {
  //   /* automate right paddle */
  //   gameProperties.rightPaddle.position.y = ball.position.y;
  //   /* set both paddle to not go out of bounds */
  //   if (mouse.position.y < gameProperties.leftPaddle.height / 2)
  //     mouse.position.y = gameProperties.leftPaddle.height / 2;
  //   if (
  //     mouse.position.y >
  //     gameProperties.screen.y - gameProperties.leftPaddle.height / 2
  //   )
  //     mouse.position.y =
  //       gameProperties.screen.y - gameProperties.leftPaddle.height / 2;
  //   if (
  //     gameProperties.rightPaddle.position.y <
  //     gameProperties.leftPaddle.height / 2
  //   )
  //     gameProperties.rightPaddle.position.y =
  //       gameProperties.leftPaddle.height / 2;
  //   if (
  //     gameProperties.rightPaddle.position.y >
  //     gameProperties.screen.y - gameProperties.leftPaddle.height / 2
  //   )
  //     gameProperties.rightPaddle.position.y =
  //       gameProperties.screen.y - gameProperties.leftPaddle.height / 2;
  //   /* set left paddle position to follow mouse movement */
  //   Matter.Body.setPosition(leftPaddle, {
  //     x: gameProperties.leftPaddle.position.x,
  //     y: mouse.position.y,
  //   });
  //   /* set right paddle position to follow ball position */
  //   Matter.Body.setPosition(rightPaddle, {
  //     x: gameProperties.rightPaddle.position.x,
  //     y: gameProperties.rightPaddle.position.y,
  //   });
  //   /* reset ball position when ball goes out of bounds */
  //   if (ball.position.y < 0 || ball.position.y > render.canvas.height) {
  //     Matter.Body.setPosition(ball, {
  //       x: gameProperties.screen.x / 2,
  //       y: gameProperties.screen.y / 2,
  //     });
  //     Matter.Body.setVelocity(ball, {
  //       x: gameProperties.ball.speed.x,
  //       y: gameProperties.ball.speed.y,
  //     });
  //   }
  //   /* handle perfect timing and move left paddle position when key press */
  //   if (" " in keyArr && keyArr[" "].keyPressDown) {
  //     // set perfect hit timeframe
  //     if (
  //       keyArr[" "].pressDuration >= 1 &&
  //       keyArr[" "].pressDuration <= gameProperties.ball.perfectHitDuration
  //     ) {
  //       if (
  //         ball.position.x > leftPaddle.position.x &&
  //         ball.position.x <=
  //           leftPaddle.position.x + gameProperties.ball.perfectHitZone &&
  //         ball.position.y >=
  //           leftPaddle.position.y - gameProperties.ball.perfectHitZone &&
  //         ball.position.y <=
  //           leftPaddle.position.y + gameProperties.ball.perfectHitZone
  //       ) {
  //         Matter.Body.setVelocity(ball, {
  //           x: ball.speed * 1.5,
  //           y: gameProperties.ball.speed.y,
  //         });
  //       }
  //     }
  //     /* move left paddle position backwards */
  //     const paddle = Matter.Bodies.rectangle(
  //       gameProperties.leftPaddle.position.x - 15,
  //       leftPaddle.position.y,
  //       gameProperties.leftPaddle.width,
  //       gameProperties.leftPaddle.height,
  //       {
  //         isStatic: true,
  //         density: 0.1,
  //         friction: 0.2,
  //         restitution: 0.8,
  //       },
  //     );
  //     Matter.World.remove(engine.world, leftPaddle);
  //     Matter.World.add(engine.world, paddle);
  //     leftPaddle = paddle;
  //   }
  //   /* reset left paddle position to default on key release */
  //   if (" " in keyArr && !keyArr[" "].keyPressDown) {
  //     const paddle = Matter.Bodies.rectangle(
  //       gameProperties.leftPaddle.position.x,
  //       leftPaddle.position.y,
  //       gameProperties.leftPaddle.width,
  //       gameProperties.leftPaddle.height,
  //       { isStatic: true },
  //     );
  //     Matter.World.remove(engine.world, leftPaddle);
  //     Matter.World.add(engine.world, paddle);
  //     leftPaddle = paddle;
  //   }
  // });

  return null;
};

export default Game;

// /* handle key press */
// const handleKeyDown = (event: KeyboardEvent) => {
//   if (!(event.key in keyArr)) {
//     keyArr[event.key] = {
//       key: event.key,
//       keyPressDown: true,
//       pressDuration: 0,
//     };
//   }
//   keyArr[event.key].keyPressDown = true;
//   if (
//     event.key === " " &&
//     keyArr[event.key].pressDuration <= gameProperties.ball.maxTimeFrame
//   )
//     keyArr[event.key].pressDuration += 1;
//   console.log("keydown ", keyArr[event.key]);
// };

// /* handle key release */
// const handleKeyUp = (event: KeyboardEvent) => {
//   keyArr[event.key].keyPressDown = false;
//   keyArr[event.key].pressDuration = 0;
//   console.log("keyup ", keyArr[event.key]);
// };

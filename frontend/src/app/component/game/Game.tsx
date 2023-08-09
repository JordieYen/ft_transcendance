import { SocketContext } from "@/app/socket/SocketProvider";
import Matter, { Vector } from "matter-js";
import { useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useGameData } from "./GameContext";
import useGameStore from "@/store/useGameStore";
import router from "next/router";
import ScoreExplosion from "@/components/game/ScoreExplosion";

interface ScoreBoard {
  winner: number;
  ballYPos: number;
  pOneScore: number;
  pTwoScore: number;
}

interface KeyType {
  key: string;
  keyPressDown: boolean;
  pressDuration: number;
}

interface Ball {
  position: Vector;
  radius: number;
  smashSpeed: number;
  maxTimeFrame: number;
  perfectHitZone: number;
  perfectHitDuration: number;
}

interface Paddle {
  width: number;
  height: number;
  position: Vector;
  holdPosition: Vector;
}

interface GameElements {
  screen: Vector;
  border: Vector;
  ball: Ball;
  leftPaddle: Paddle;
  rightPaddle: Paddle;
}

const screenWidth = 2000 / 2;
const screenHeight = 700;

const borderWidth = screenWidth;
const borderHeight = 100;

const paddleWidth = 25;
const paddleHeight = 150;
const paddleHoldDiff = 15;

const gameProperties: GameElements = {
  screen: { x: screenWidth, y: screenHeight },
  border: { x: borderWidth, y: borderHeight },
  ball: {
    position: { x: screenWidth / 2, y: screenHeight / 2 },
    radius: 20,
    smashSpeed: 1.5,
    maxTimeFrame: 5,
    perfectHitZone: 50,
    perfectHitDuration: 10,
  },
  leftPaddle: {
    width: paddleWidth,
    height: paddleHeight,
    position: { x: paddleWidth * 2, y: screenHeight / 2 },
    holdPosition: {
      x: paddleWidth * 2 - paddleHoldDiff,
      y: screenHeight / 2,
    },
  },
  rightPaddle: {
    width: paddleWidth,
    height: paddleHeight,
    position: { x: screenWidth - paddleWidth * 2, y: screenHeight / 2 },
    holdPosition: {
      x: screenWidth - paddleWidth * 2 + paddleHoldDiff,
      y: screenHeight / 2,
    },
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

  return { engine, runner, leftPaddle, rightPaddle, ball };
};

const Game = () => {
  const gameMode = useRef("");
  const currentPlayer = useRef("");
  const currentUser = useRef();
  const gameState = useGameData().gameState;
  const [gameData, setGameData] = useGameStore((state) => [
    state.gameData,
    state.setGameData,
  ]);

  const socket = useContext(SocketContext);
  // const socket = io("http://localhost:3000");

  useEffect(() => {
    if (socket) {
      socket.emit("initialize-game", {
        roomId: gameState!.roomId,
        pOneId: gameState!.player1User.id,
        pTwoId: gameState!.player2User.id,
        gameProperties: gameProperties,
      });
      if (gameState!.player1User.socketId === socket.id) {
        currentPlayer.current = "p1";
        currentUser.current = gameState!.player1User;
      } else if (gameState!.player2User.socketId === socket.id) {
        currentPlayer.current = "p2";
        currentUser.current = gameState!.player2User;
      }
      gameMode.current = gameState!.player1User.gameMode;
    }

    const keyArr: { [key: string]: KeyType } = {};
    let { engine, runner, leftPaddle, rightPaddle, ball } = initializeGame();
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
    const movePaddleInterval = setInterval(() => {
      socket?.emit("mouse-position", {
        roomId: gameState!.roomId,
        player: currentPlayer.current,
        mouseY: mouse.position.y,
        gameProperties: gameProperties,
      });
    }, 15);

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
    };

    /* handle key up */
    const handleKeyUp = (event: KeyboardEvent) => {
      keyArr[event.key].keyPressDown = false;
      keyArr[event.key].pressDuration = 0;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    Matter.Events.on(engine, "beforeUpdate", function () {
      /* set both paddle to not go out of bounds */
      if (mouse.position.y < gameProperties.leftPaddle.height / 2)
        mouse.position.y = gameProperties.leftPaddle.height / 2;
      if (
        mouse.position.y >
        gameProperties.screen.y - gameProperties.leftPaddle.height / 2
      )
        mouse.position.y =
          gameProperties.screen.y - gameProperties.leftPaddle.height / 2;

      /* set paddle to follow mouse movement */
      if (currentPlayer.current === "p1") {
        Matter.Body.setPosition(leftPaddle, {
          x: gameProperties.leftPaddle.position.x,
          y: mouse.position.y,
        });
      }
      if (currentPlayer.current === "p2") {
        Matter.Body.setPosition(rightPaddle, {
          x: gameProperties.rightPaddle.position.x,
          y: mouse.position.y,
        });
      }

      /* start game */
      if ("s" in keyArr && keyArr["s"].keyPressDown) {
        socket?.emit("start-game", {
          gameMode: gameMode.current,
          roomId: gameState!.roomId,
          player: currentPlayer.current,
          gameProperties: gameProperties,
        });
      }

      /* activate paddle on key press */
      if (" " in keyArr && keyArr[" "].keyPressDown) {
        socket?.emit("active-paddle", {
          gameMode: gameMode.current,
          roomId: gameState!.roomId,
          player: currentPlayer.current,
          gameProperties: gameProperties,
        });

        if (gameMode.current === "custom") {
          if (currentPlayer.current === "p1") {
            Matter.Body.setPosition(leftPaddle, {
              x: gameProperties.leftPaddle.holdPosition.x,
              y: leftPaddle.position.y,
            });
          }
          if (currentPlayer.current === "p2") {
            Matter.Body.setPosition(rightPaddle, {
              x: gameProperties.rightPaddle.holdPosition.x,
              y: rightPaddle.position.y,
            });
          }
        }
      }

      /* deactivate paddle on key release */
      if (" " in keyArr && !keyArr[" "].keyPressDown) {
        socket?.emit("passive-paddle", {
          gameMode: gameMode.current,
          roomId: gameState!.roomId,
          player: currentPlayer.current,
          gameProperties: gameProperties,
        });
        if (gameMode.current === "custom") {
          if (currentPlayer.current === "p1") {
            Matter.Body.setPosition(leftPaddle, {
              x: gameProperties.leftPaddle.position.x,
              y: leftPaddle.position.y,
            });
          }
          if (currentPlayer.current === "p2") {
            Matter.Body.setPosition(rightPaddle, {
              x: gameProperties.rightPaddle.position.x,
              y: rightPaddle.position.y,
            });
          }
        }
      }
    });

    socket?.on("ball-speed", (ballSpeed: Vector) => {
      Matter.Body.setVelocity(ball, {
        x: ballSpeed.x,
        y: ballSpeed.y,
      });
    });

    socket?.on("ball-position", (ballPos: Vector) => {
      Matter.Body.setPosition(ball, {
        x: ballPos.x,
        y: ballPos.y,
      });
    });

    socket?.on("reset-ball-speed", () => {
      Matter.Body.setVelocity(ball, {
        x: 0,
        y: 0,
      });
    });

    socket?.on("reset-ball-position", () => {
      Matter.Body.setPosition(ball, {
        x: gameProperties.screen.x / 2,
        y: gameProperties.screen.y / 2,
      });
    });

    socket?.on("left-paddle-position", (paddlePos: Vector) => {
      Matter.Body.setPosition(leftPaddle, {
        x: paddlePos.x,
        y: paddlePos.y,
      });
    });

    socket?.on("right-paddle-position", (paddlePos: Vector) => {
      Matter.Body.setPosition(rightPaddle, {
        x: paddlePos.x,
        y: paddlePos.y,
      });
    });

    socket?.on("update-score", (score: ScoreBoard) => {
      setGameData({
        ...gameData,
        p1Score: score.pOneScore,
        p2Score: score.pTwoScore,
      });
      // ScoreExplosion({ winPlayer: score.winner, yPos: score.ballYPos });
    });

    /* end game and clear screen */
    const endGame = () => {
      clearInterval(movePaddleInterval);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      Matter.World.clear(engine.world, true);
      Matter.Engine.clear(engine);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      render.canvas.remove();
      render.textures = {};
      setGameData({
        ...gameData,
        p1Score: 0,
        p2Score: 0,
      });
      socket?.off("ball-speed");
      socket?.off("ball-position");
      socket?.off("reset-ball-speed");
      socket?.off("left-paddle-position");
      socket?.off("right-paddle-position");
      socket?.off("update-score");
    };

    /* ends game from backend */
    socket?.on("game-over", () => {
      endGame();
      router.push("/main-menu");
    });

    /* ends game to backend */
    const handleRouteChange = () => {
      endGame();
      console.log("on route change");
      socket?.emit("clear-room", {
        roomId: gameState!.roomId,
        user: currentUser.current,
      });
    };
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      socket?.off("game-over");
      clearInterval(movePaddleInterval);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return null;
};

export default Game;

import { use, useContext, useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import Matter from 'matter-js';
import MatchMaking from "./MatchMaking";
import { useGameData } from "./GameContext";
import { log } from "console";

const Game = () => {
    const scoreLeftRef = useRef(0);
    const scoreRightRef = useRef(0);
    const isGameOver = useRef(false);
    const animationFrameId = useRef(0);
    const winnerTextRef = useRef<PIXI.Text | null>(null);
    const { gameState } = useGameData();
    console.log('gameState', gameState);

    useEffect(() => {
        const app = new PIXI.Application({
            width: 1200,
            height: 900,
            backgroundColor: 0x000000,
        });

        const background = PIXI.Sprite.from('/achievement/Lee_Zii_Jia.png');
        background.width = app?.view.width;
        background.height = app?.view.height;
        app.stage.addChild(background);

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.appendChild(app?.view as any);
        document.body.appendChild(container);

        const engine = Matter.Engine.create();
        const world = engine.world;
        engine.gravity.y = 0;

        // Score
        const scoreTextLeft = new PIXI.Text("Score: 0", {
            fontFamily: "Arial",
            fontSize: 24,
            fill: 0xFFFFFF,
        });
        scoreTextLeft.position.set(app?.view.width * 0.05, 10);


        const scoreTextRight = new PIXI.Text("Score: 0", {
            fontFamily: "Arial",
            fontSize: 24,
            fill: 0xFFFFFF,
        });
        scoreTextRight.position.set(app?.view.width * 0.85, 10);

        app.stage.addChild(scoreTextLeft);
        app.stage.addChild(scoreTextRight);

        // Paddles
        const paddleLeft =  new PIXI.Graphics();
        paddleLeft.beginFill(0xFFFFFF);
        paddleLeft.drawRect(0, 0, 20, 100);
        paddleLeft.endFill();
        paddleLeft.position.set(app?.view.width * 0.05, app.view.height * 0.5);

        const paddleRight =  new PIXI.Graphics();
        paddleRight.beginFill(0xFFFFFF);
        paddleRight.drawRect(0, 0, 20, 100);
        paddleRight.endFill();
        // paddleRight.position.set(app.view.width * 0.95, app.view.height * 0.5);
        paddleRight.position.set(app.view.width * 0.95 - paddleRight.width, app.view.height * 0.5 - paddleRight.height / 2);


        const ball = new PIXI.Graphics();
        ball.beginFill(0xFFFFFF);
        ball.drawCircle(0, 0, 10);
        ball.endFill();
        ball.position.set(500, 500);

        app.stage.addChild(paddleLeft);
        app.stage.addChild(paddleRight);
        app.stage.addChild(ball);

        const ballBody = Matter.Bodies.circle(500, 500, 10, {
            restitution: 1,
            friction: 0,
            frictionAir: 0,
            slop: 0,
            render: {
                visible: true,
                fillStyle: "#ffffff",
            }
        });
        Matter.World.add(world, ballBody);
      
        const paddleLeftWidth = 20;
        const paddleLeftHeight = 100;
        const paddleLeftBody = Matter.Bodies.rectangle(
        app.view.width * 0.1,
        app.view.height * 0.5,
        paddleLeftWidth,
        paddleLeftHeight,
            {
                isStatic: true,
                render: {
                    fillStyle: "#ffffff",
                },
            }
        );
        Matter.World.add(world, paddleLeftBody);

        // const paddleRightWidth = 20;
        // const paddleRightHeight = 100;
        // const paddleRightBody = Matter.Bodies.rectangle(
        // app.view.width * 0.1,
        // app.view.height * 0.5,
        // paddleRightWidth,
        // paddleRightHeight,
        //     {
        //         isStatic: true,
        //         render: {
        //             fillStyle: "#ffffff",
        //         },
        //     }
        // );

        const paddleRightWidth = 20;
        const paddleRightHeight = 100;
        const paddleRightBody = Matter.Bodies.rectangle(
            app.view.width * 0.95 - paddleRight.width / 2,
            app.view.height * 0.5 - paddleRight.height / 2,
            paddleRightWidth,
            paddleRightHeight,
            {
              isStatic: true,
              render: {
                fillStyle: "#ffffff",
              },
            }
        );
        Matter.World.add(world, paddleRightBody);

        const winnerText = new PIXI.Text("Winner ", {
            fontFamily: "Arial",
            fontSize: 48,
            fill: 0xFFFFFF,
        });
        winnerText.position.set(app.view.width * 0.5, app.view.height * 0.5);
        winnerText.anchor.set(0.5);
        winnerText.visible = false;
        app.stage.addChild(winnerText);
        winnerTextRef.current = winnerText;

        Matter.Events.on(engine, "collisionStart", (event) => {
            const pairs = event.pairs;
      
            pairs.forEach((pair) => {
              if (
                (pair.bodyA === ballBody && pair.bodyB === paddleLeftBody) ||
                (pair.bodyA === paddleLeftBody && pair.bodyB === ballBody)
              ) {
                const normal = pair.bodyA === paddleLeftBody ? { x: -1, y: 0 } : { x: 1, y: 0 };
                const reflection = Matter.Vector.sub(
                  ballBody.velocity,
                  Matter.Vector.mult(normal, 2 * Matter.Vector.dot(ballBody.velocity, normal))
                );
                Matter.Body.setVelocity(ballBody, reflection);
                // paddleHitAudio.play();
              } else if (
                (pair.bodyA === ballBody && pair.bodyB === paddleRightBody) ||
                (pair.bodyA === paddleRightBody && pair.bodyB === ballBody)
            ) {
                const normal = pair.bodyA === paddleRightBody ? { x: 1, y: 0 } : { x: -1, y: 0 };
                const reflection = Matter.Vector.sub(
                    ballBody.velocity,
                    Matter.Vector.mult(normal, 2 * Matter.Vector.dot(ballBody.velocity, normal))
                );
                Matter.Body.setVelocity(ballBody, reflection);
                // paddleHitAudio.play();
            }
            });
        });
        
        const initialVelocity = { 
            x: Math.random() > 0.5 ? -10 : 10,
            y: (Math.random() - 0.5 ) * 10 };
        Matter.Body.setVelocity(ballBody, initialVelocity);

        // Keyboard input handling
        const keys: { [key: string]: boolean } = {};
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        document.addEventListener("keydown", handleKeyEnter);


        function handleKeyDown(e: KeyboardEvent) {
            keys[e.code] = true;
        }
        function handleKeyUp(e: KeyboardEvent) {
            keys[e.code] = false;
        }

        function handleKeyEnter(e: KeyboardEvent) {
            if (e.code === "Enter" && isGameOver.current && winnerTextRef.current) {
                scoreLeftRef.current = 0;
                scoreRightRef.current = 0;
                isGameOver.current = false;
                winnerTextRef.current.visible = false;
                gameLoop();
            }
        }

        const resetBall = () => {
            const resetX = app.view.width / 2;
            const resetY = app.view.height / 2;
            const resetVelocity = {
              x: Math.random() > 0.5 ? -10 : 10,
              y: (Math.random() - 0.5) * 10,
            };
            Matter.Body.setPosition(ballBody, { x: resetX, y: resetY });
            Matter.Body.setVelocity(ballBody, resetVelocity);
        };


        // automated right paddle
        const moveOpponentPaddle = () => {
            const paddleSpeed = 20;
        
            // Calculate the difference between the opponent paddle's y position and the ball's y position
            const difference = ball.y - paddleRight.y;
        
            // Move the opponent paddle towards the ball
            if (difference > paddleSpeed / 2) {
              paddleRight.y += paddleSpeed;
            } else if (difference < -paddleSpeed / 2) {
              paddleRight.y -= paddleSpeed;
            }
        };

        // Game loop
        const gameLoop = () => {

            if (app) {

                // requestAnimationFrame(gameLoop);
                animationFrameId.current = requestAnimationFrame(gameLoop);


                const paddleSpeed = 15;
                // move paddles
                if (keys["KeyW"]) {
                    if (paddleLeft.y > 0) {
                        paddleLeft.y -= paddleSpeed;

                    }
                } else if (keys["KeyS"]) {
                    if (paddleLeft.y < app?.view.height - paddleLeft.height) {
                        paddleLeft.y += paddleSpeed;
                    }
                }

                moveOpponentPaddle();

                // if (keys["ArrowUp"]) {
                //     if (paddleRight.y > 0) {
                //         paddleRight.y -= paddleSpeed;
                //     }
                // } else if (keys["ArrowDown"]) {
                //     if (paddleRight.y < app?.view.height - paddleRight.height) {
                //         paddleRight.y += paddleSpeed;
                //     }
                // }

                Matter.Body.setPosition(paddleLeftBody, {
                    x: paddleLeft.x + 10,
                    y: paddleLeft.y + 50,
                });

                Matter.Body.setPosition(paddleRightBody, {
                    x: paddleRight.x + 10,
                    y: paddleRight.y + 50,
                });

                ball.position.x = ballBody.position.x;
                ball.position.y = ballBody.position.y;
    
                const ballRadius = ball.width / 2;
                const appWidth = app?.view.width;
                const appHeight = app?.view.height;

                // check if ball is outside of the screen x
                if (ball.x < -ballRadius) {
                    // Ball went out on the left side
                    scoreRightRef.current += 1;
                    resetBall();
                } else if (ball.x > appWidth + ballRadius) {
                    // Ball went out on the right side
                    scoreLeftRef.current += 1;
                    resetBall();
                }
                        
                // check if ball is outside of the screen y
                if (ball.y - ballRadius < 0 ||
                    ball.y + ballRadius > appHeight) {
                        const reflection = { x: ballBody.velocity.x, y: -ballBody.velocity.y };
                        Matter.Body.setVelocity(ballBody, reflection);
                }
                app.renderer.render(app.stage);
                Matter.Engine.update(engine);


                // Update score text
                scoreTextLeft.text = `Score: ${scoreLeftRef.current}`;
                scoreTextRight.text = `Score: ${scoreRightRef.current}`;

                if (scoreLeftRef.current >= 2) {
                    isGameOver.current = true;
                } else if (scoreRightRef.current >= 2) {
                    isGameOver.current = true;
                }

                if (isGameOver.current) {
                    cancelAnimationFrame(animationFrameId.current);
                    if (winnerTextRef.current) {
                        winnerTextRef.current.text = scoreLeftRef.current >= 2 ? 
                        "Left Wins!\nEnter for next game" : 
                        "Right Wins!\nEnter for next game";
                        winnerTextRef.current.visible = true;
                    }
                }
            }
        }
        gameLoop();
        return () => {
            app.destroy(true);
            // app.stage.destroy(true);
            Matter.World.clear(world, true);
            Matter.Engine.clear(engine);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        }
    }, []);

    return null;
};

export default Game;

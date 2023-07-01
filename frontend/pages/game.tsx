import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import Matter from 'matter-js';
import { Node } from "typescript";

const GamePage = () => {

    useEffect(() => {
        const app = new PIXI.Application({
            width: 1000,
            height: 900,
            backgroundColor: 0x1099bb,
        });
        document.body.appendChild(app.view as any);
        const engine = Matter.Engine.create();
        const world = engine.world;
        const paddle =  new PIXI.Graphics();
        paddle.beginFill(0x000000);
        paddle.drawRect(0, 0, 100, 20);
        paddle.endFill();
        paddle.position.set(450, 800);

        const ball = new PIXI.Graphics();
        ball.beginFill(0x000000);
        ball.drawCircle(0, 0, 10);
        ball.endFill();
        ball.position.set(500, 500);
        
        app.stage.addChild(paddle);
        app.stage.addChild(ball);

        const gameLoop = () => {
            requestAnimationFrame(gameLoop);
            app.renderer.render(app.stage);
            Matter.Engine.update(engine);
        }

        gameLoop();
        return () => {
            app.destroy(true);
            Matter.World.clear(world, true);
            Matter.Engine.clear(engine);
        }
    }, []);
}


export default GamePage;

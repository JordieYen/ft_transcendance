import useGameStore from "@/store/useGameStore";
import * as PIXI from "pixi.js";
import { useEffect, useRef } from "react";

const KillStreak = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const gameData = useGameStore((state) => state.gameData);

  useEffect(() => {
    if (gameData.currentStreak !== 0 && ref.current) {
      const app = new PIXI.Application<HTMLCanvasElement>({
        autoStart: false,
        resizeTo: window,
        backgroundAlpha: 0,
      });
      ref.current.appendChild(app.view);
      PIXI.Assets.load("/game-effects/flame.json").then(() => {
        const textures = [];
        let i;

        for (i = 0; i < 32; i++) {
          const framekey = `tile0${i < 10 ? `0${i}` : i}.png`;
          const texture = PIXI.Texture.from(framekey);
          const time = 50;

          textures.push({ texture, time });
        }

        const anime = new PIXI.AnimatedSprite(textures);

        if (gameData.currentStreak === -1) {
          app.stage.removeChild(anime);
        } else {
          console.log("RUNNING");
          anime.anchor.set(0.5, 1);
          anime.angle = 180;
          if (gameData.currentStreak === 1) {
            anime.x = app.screen.width / 2.38;
          } else if (gameData.currentStreak === 2) {
            anime.x = app.screen.width / 1.7175;
          }
          anime.y = 70;
          anime.scale.set(1.8, 0.6);

          anime.play();
          app.stage.addChild(anime);
          app.start();
        }
      });
    }
  }, [gameData.currentStreak]);

  return (
    <div
      ref={ref}
      className="absolute w-screen h-screen top-0 left-0 bg-transparent z-0"
    />
  );
};

export default KillStreak;

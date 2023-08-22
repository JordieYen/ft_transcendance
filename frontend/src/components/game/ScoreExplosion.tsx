import * as PIXI from "pixi.js";
import { useEffect, useRef, useState } from "react";
import useGameAnimeStore from "@/store/useGameAnimeStore";

interface ScoreExplosionProps {
  winPlayer: number;
  yPos: number;
}

const ScoreExplosion = ({ winPlayer, yPos }: ScoreExplosionProps) => {
  const [gameAnime, setGameAnime] = useGameAnimeStore((state) => [
    state.gameAnime,
    state.setGameAnime,
  ]);
  const [runAnimation, setRunAnimation] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("RUNNINGNGGGG");
    if (gameAnime.textureCache === false) {
      PIXI.Assets.load("/game-effects/explosion-1.json").then(() => {
        const textures = [];
        let i;

        for (i = 0; i < 58; i++) {
          const framekey = `DEATH P3${i < 10 ? `0${i}` : i}.png`;
          const texture = PIXI.Texture.from(framekey);
          const time = 20;

          textures.push({ texture, time });
        }
        setGameAnime({ ...gameAnime, texture: textures, textureCache: true });
      });
    }
    setRunAnimation(true);
  }, []);

  useEffect(() => {
    if (ref.current && runAnimation && gameAnime.texture.length > 0) {
      const app = new PIXI.Application<HTMLCanvasElement>({
        autoStart: false,
        resizeTo: window,
        backgroundAlpha: 0,
      });
      ref.current.appendChild(app.view);

      console.log("TEXTURE DONEEEEE", gameAnime.texture);
      const anime = new PIXI.AnimatedSprite(gameAnime.texture);

      anime.anchor.set(0.5, 1);
      if (winPlayer === 1) {
        anime.angle = -90 + ((yPos - 0.5) / 0.5) * 30;
        anime.x = app.screen.width;
      } else {
        anime.angle = 90 - ((yPos - 0.5) / 0.5) * 30;
        anime.x = 0;
      }
      anime.scale.set(0.8, 1.6);

      anime.y = yPos * app.screen.height;
      anime.loop = false; // Set loop property to false to play the animation only once
      anime.onComplete = () => {
        // This callback will be called when the animation completes playing
        app.stage.removeChild(anime); // Remove the sprite from the stage after animation completion if needed
      };
      anime.play();
      app.stage.addChild(anime);

      // start animating
      app.start();
    }
  }, [runAnimation, gameAnime.texture]);

  return (
    <div
      ref={ref}
      className="absolute w-screen h-screen top-0 left-0 bg-transparent cursor-none"
    />
  );
};

export default ScoreExplosion;

import * as PIXI from "pixi.js";
import { Stage, usePixiApp } from "react-pixi-fiber";
import { useEffect, useRef, useState } from "react";
import useGameAnimeStore from "@/store/useGameAnimeStore";

const SpriteAnimationContainer = () => {
  const app = usePixiApp();
  const [textures, gameAnime, setGameAnime] = useGameAnimeStore((state) => [
    state.textures,
    state.gameAnime,
    state.setGameAnime,
  ]);

  useEffect(() => {
    if (gameAnime.startAnimate && textures) {
    }
  }, []);

  return null;
};

const ScoreExplosion = () => {
  const [textures, setTextures, gameAnime, setGameAnime] = useGameAnimeStore(
    (state) => [
      state.textures,
      state.setTextures,
      state.gameAnime,
      state.setGameAnime,
    ],
  );
  const app = new PIXI.Application<HTMLCanvasElement>({
    autoStart: false,
    resizeTo: window,
    backgroundAlpha: 0,
  });

  /***********************************/
  /* Pre-rendering of Texture Frames */
  /***********************************/
  useEffect(() => {
    if (textures.length === 0) {
      PIXI.Assets.load("/game-effects/explosion-1.json").then(() => {
        const textures = [];
        let i;

        for (i = 0; i < 58; i++) {
          const framekey = `DEATH P3${i < 10 ? `0${i}` : i}.png`;
          const texture = PIXI.Texture.from(framekey);
          const time = 20;

          textures.push({ texture, time });
        }
        setTextures(textures);
      });
    }
  }, []);

  console.log("GAMEANIMESTORE", gameAnime);

  useEffect(() => {
    console.log("USEEFFECT RUNS", textures, gameAnime);
    if (
      gameAnime.startAnimate &&
      textures.length > 0 &&
      gameAnime.winPlayer !== 0
    ) {
      console.log("TEXTURE", textures, gameAnime);

      const anime = new PIXI.AnimatedSprite(textures);

      anime.anchor.set(0.5, 1);
      anime.scale.set(0.8, 1.6);
      anime.loop = false; // Set loop property to false to play the animation only once

      if (gameAnime.winPlayer === 1) {
        anime.angle = -90 + ((gameAnime.yPos - 0.5) / 0.5) * 30;
        anime.x = app.screen.width;
      } else {
        anime.angle = 90 - ((gameAnime.yPos - 0.5) / 0.5) * 30;
        anime.x = 0;
      }
      anime.y = gameAnime.yPos * app.screen.height;

      console.log("calc done");

      anime.onComplete = () => {
        // This callback will be called when the animation completes playing
        app.stage.removeChild(anime); // Remove the sprite from the stage after animation completion if needed
        setGameAnime({ ...gameAnime, startAnimate: false, winPlayer: 0 });
        console.log("done");
      };
      anime.play();
      app.stage.addChild(anime);

      // start animating
      app.start;
    }
  }, [gameAnime.startAnimate]);

  return (
    <Stage options={{ autoStart: false, resizeTo: window, backgroundAlpha: 0 }}>
      <SpriteAnimationContainer />
    </Stage>
  );
};

export default ScoreExplosion;

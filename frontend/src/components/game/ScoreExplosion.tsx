import * as PIXI from "pixi.js";
import { Stage, usePixiApp } from "react-pixi-fiber";
import { useEffect, useRef, useState } from "react";
import useGameAnimeStore, { GameAnime } from "@/store/useGameAnimeStore";

interface SpriteAnimationContainerProps {
  textures: any[];
  gameAnime: GameAnime;
  postAction: () => void;
}

const SpriteAnimationContainer = ({
  textures,
  gameAnime,
  postAction,
}: SpriteAnimationContainerProps) => {
  const app = usePixiApp();

  console.log("SPRITEANIMATIONCONTAINER RUNS", app);

  useEffect(() => {
    if (
      gameAnime.startAnimate &&
      textures.length > 0 &&
      gameAnime.winPlayer !== 0
    ) {
      console.log("TEXTURE", textures, gameAnime);
      const anime = new PIXI.AnimatedSprite(textures);

      anime.anchor.set(0.5, 1);
      anime.scale.set(0.8, 1.6);
      anime.loop = false;

      if (gameAnime.winPlayer === 1) {
        anime.angle = -90 + ((gameAnime.yPos - 0.5) / 0.5) * 30;
        anime.x = app.screen.width;
      } else {
        anime.angle = 90 - ((gameAnime.yPos - 0.5) / 0.5) * 30;
        anime.x = 0;
      }
      anime.y = gameAnime.yPos * app.screen.height;

      app.stage.addChild(anime);

      anime.onComplete = () => {
        app.stage.removeChild(anime);
        postAction();
        console.log("done");
      };

      anime.play();

      app.start();
    }
  }, [gameAnime.startAnimate]);

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

  return (
    <Stage
      className={`absolute top-0 left-0 ${
        gameAnime.startAnimate ? "block" : "hidden"
      }`}
      options={{ autoStart: false, resizeTo: window, backgroundAlpha: 0 }}
    >
      <SpriteAnimationContainer
        textures={textures}
        gameAnime={gameAnime}
        postAction={() =>
          setGameAnime({ ...gameAnime, startAnimate: false, winPlayer: 0 })
        }
      />
    </Stage>
  );
};

export default ScoreExplosion;

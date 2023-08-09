import { UserData } from "@/store/useUserStore";
import Image from "next/image";
import { use, useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { useRouter } from "next/router";
import { useGameData } from "./GameContext";

interface LoadingScreenProps {
  roomId: string | null;
  player1User: UserData;
  player2User: UserData;
}

const LoadingScreen = ({
  player1User,
  player2User,
  roomId,
}: LoadingScreenProps) => {
  const router = useRouter();
  const { setLoadingScreenVisible } = useGameData();
  const updateLoadingBarWidth = (
    redBorder: PIXI.Graphics,
    loadingContainer: Element | null,
    app: PIXI.Application,
    loadingBar: PIXI.Sprite,
    currentCountdown: number,
  ) => {
    loadingContainer = document.querySelector(".loading-container");
    const width = loadingContainer?.clientWidth || 400;
    const progressWidth = (currentCountdown / 6) * width;
    loadingBar.x = progressWidth - loadingBar.width;
    redBorder.drawRect(0, 0, width, 40);
    redBorder.clear();
    redBorder.lineStyle(4, 0xca4754, 1);
    redBorder.drawRect(0, 0, width, 40);
    app.renderer.resize(width, 40);
  };

  useEffect(() => {
    const loadingContainer = document.querySelector(".loading-container");
    const width = loadingContainer?.clientWidth || 400;
    const app = new PIXI.Application({
      width: width,
      height: 40,
    });

    loadingContainer?.appendChild(app.view as HTMLCanvasElement);

    const loadingBar = PIXI.Sprite.from("/bracket.png");
    loadingBar.height = 40;
    loadingBar.x = -loadingBar.width;
    app.stage.addChild(loadingBar);

    const redBorder = new PIXI.Graphics();
    redBorder.lineStyle(4, 0xca4754, 1);
    redBorder.drawRect(0, 0, width, 40);
    app.stage.addChild(redBorder);

    let currentCountdown = 0;
    const countdownInterval = setInterval(() => {
      currentCountdown++;
      if (currentCountdown > 3) {
        clearInterval(countdownInterval);
        setLoadingScreenVisible(false);
        router.push("/game");
      }
      const progressWidth = (currentCountdown / 3) * width;
      loadingBar.x = progressWidth - loadingBar.width;
    }, 1000);

    const handleResize = () => {
      console.log("handleResize");

      updateLoadingBarWidth(
        redBorder,
        loadingContainer,
        app,
        loadingBar,
        currentCountdown,
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(countdownInterval);
      window.removeEventListener("resize", handleResize);
      loadingContainer?.removeChild(app.view as HTMLCanvasElement);
      app.destroy();
    };
  }, [player1User, player2User]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
      <div className="loading-container bg-black absolute top-20 w-4/5 h-3/5 left-1/2 transform -translate-x-1/2">
        <div className="flex justify-between bg-black p-4 rounded-lg h-full">
          <div className="flex flex-col items-center justify-top">
            <p className="text-white">Player 1: {player1User?.username}</p>
            <Image
              className="transform hover:scale-125 object-cover rounded-full"
              src={player1User?.avatar || ""}
              alt="user avatar"
              width={150}
              height={150}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-white text-4xl font-bold">VS</p>
          </div>
          <div className="flex flex-col items-center justify-end">
            <p className="text-white">Player 2: {player2User?.username}</p>
            <Image
              className="transform hover:scale-125 object-cover rounded-full"
              src={player2User?.avatar || ""}
              alt="user avatar"
              width={150}
              height={150}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

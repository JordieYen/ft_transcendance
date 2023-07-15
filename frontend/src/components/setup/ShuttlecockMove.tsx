import React, { useEffect, useRef, useState } from "react";
import SvgShuttlecock from "./SvgShuttlecock";
import { motion, useSpring, useTransform } from "framer-motion";
import useAnimateStore, { Step } from "@/store/useAnimateStore";

// const path = "M 239 17 C 142 17 48.5 103 48.5 213.5 C 48.5 324 126 408 244 408 C 362 408 412 319 412 213.5 C 412 108 334 68.5 244 68.5 C 154 68.5 102.68 135.079 99 213.5 C 95.32 291.921 157 350 231 345.5 C 305 341 357.5 290 357.5 219.5 C 357.5 149 314 121 244 121 C 174 121 151.5 167 151.5 213.5 C 151.5 260 176 286.5 224.5 286.5 C 273 286.5 296.5 253 296.5 218.5 C 296.5 184 270 177 244 177 C 218 177 197 198 197 218.5 C 197 239 206 250.5 225.5 250.5 C 245 250.5 253 242 253 218.5"

// const path = " M0.5 21.5C198.5 -13 475.5 -48.3 1000 1000";

// const transition = { duration: 4, yoyo: Infinity, ease: "easeOut" };

type StepObject = {
  [K in Step]: string;
};

export default function ShuttlecockMove() {
  const [currentStep] = useAnimateStore((store) => [store.currentStep]);
  const divRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<StepObject>({
    name: "",
    avatar: "",
    tfa: "",
    start: "",
  });
  // const [index, setIndex] = useState(0);
  const progress = useSpring(0, {
    damping: 5,
    mass: 0.5,
    stiffness: 5,
    velocity: 0.5,
    bounce: 0,
  });
  const offest = useTransform(progress, [0, 1], ["0%", "100%"]);
  const shadow = useTransform(
    progress,
    [0, 0.4, 0.65, 1],
    [
      "drop-shadow(0.1px 0.2px 0.2px rgb(0 255 0 / 0.5))",
      "drop-shadow(8px 16px 16px rgb(0 255 0 / 0.25))",
      "drop-shadow(8px 16px 16px rgb(0 255 0 / 0.25))",
      "drop-shadow(0.1px 0.2px 0.2px rgb(0 255 0 / 0.5))",
    ],
  );

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setIndex((curr) => {
  //       if (curr === 2) {
  //         clearInterval(interval);
  //         return curr;
  //       } else return curr + 1;
  //     });
  //   }, 15000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  useEffect(() => {
    // console.log(index);
    progress.jump(0);
    progress.set(1);
  }, [currentStep]);

  useEffect(() => {
    if (divRef.current) {
      const dimension = divRef.current.getBoundingClientRect();

      const startY = dimension.height * 0.1;
      const boundX = dimension.width * 1.1;
      // const boundX = dimension.width * 0.5;
      const boundY = dimension.height * 0.8;

      const leftToRight = `\
        M0 ${startY} \
        Q${dimension.width * 0.6} \
        ${dimension.height * 0.2} ${boundX} ${boundY}`;

      const rightToLeft = `\
        M${boundX} ${startY} \
        Q${dimension.width * 0.6} \
        ${dimension.height * 0.2} -${dimension.width * 0.1} ${boundY}`;

      // setPath([leftToRight, rightToLeft, leftToRight]);
      setPath({
        name: leftToRight,
        avatar: rightToLeft,
        tfa: leftToRight,
        start: rightToLeft,
      });
    }

    progress.set(1);
  }, []);

  return (
    <div className="h-screen w-screen relative overflow-hidden" ref={divRef}>
      {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.path
          d={path[currentStep]}
          // d="M0.5 21.5C198.5 -13 475.5 -48.3 1000 1000"
          fill="transparent"
          strokeWidth="12"
          stroke="rgba(255, 255, 255, 0.69)"
          strokeLinecap="round"
          // initial={{ pathLength: 0 }}
          // animate={{ pathLength: 1 }}
          // transition={transition}
          pathLength={progress}
          // onAnimationComplete={() => {
          //   setIndex(index + 1);
          //   console.log("hello")
          // }}
        />
      </svg> */}
      <motion.div
        className="absolute top-0 left-0 -rotate-[120deg]"
        style={{
          offsetPath: `path("${path[currentStep]}")`,
          offsetDistance: offest,
          // boxShadow: shadow,
        }}
        // initial={{ offsetDistance: "0%" }}
        // animate={{ offsetDistance: "100%" }}
        // transition={transition}
      >
        <SvgShuttlecock width={48} height={48} style={{ filter: shadow }} />
      </motion.div>
    </div>
  );
}

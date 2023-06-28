import { motion } from "framer-motion";
// import shuttlecock from "@/../public/shuttlecock.svg";

const svg =
  "M320 32c0 8.8-7.2 16-16 16-24.4 0-46 15.8-53.4 39.1l-29.3 92.8c-1.3 4.1-4.2 7.6-8.1 9.5l-32.4 16.2c-3.1 1.5-5.6 4.1-7.2 7.2l-32.5 64.9c-3.1 6.2-1.9 13.6 3 18.5L163 315l71.9-71.9 46.2-146.3c3.2-10 12.4-16.8 22.9-16.8h104c13.3 0 24 10.7 24 24v104c0 10.5-6.8 19.7-16.8 22.9l-146.4 46.2L197 349l18.9 18.9c4.9 4.9 12.3 6.1 18.5 3l64.9-32.5c3.1-1.5 5.6-4.1 7.2-7.2l16.2-32.4c1.9-3.9 5.4-6.8 9.5-8.1l92.8-29.3c23.3-7.4 39.1-29 39.1-53.4 0-8.8 7.2-16 16-16h8c13.3 0 24 10.7 24 24v51.7c0 12.4-7.2 23.7-18.4 29L250.1 411.2c-6.7 3.1-12.8 7.4-18 12.7l-28.8 28.8-144-144 28.8-28.8a65.2 65.2 0 0 0 12.7-18L215.4 18.4C220.6 7.2 231.9 0 244.3 0H296c13.3 0 24 10.7 24 24v8zM36.7 331.3l144 144-6.9 6.9a101.8 101.8 0 0 1-72 29.8C45.6 512 0 466.4 0 410.2c0-27 10.7-52.9 29.8-72l6.9-6.9z";

const Shuttlecock = () => {
  return (
    <motion.svg
      width="70"
      height="70"
      viewBox="0 0 512 512"
      initial={{
        offsetPath: 'path("M50,-100 A 800 800 90 0 0 400 80")',
        offsetDistance: "0%",
        rotate: -90,
        y: -100,
      }}
      animate={{
        offsetDistance: "100%",
        rotate: -100,
        x: "30vw",
        y: "40vh",
      }}
      transition={{ duration: 3 }}
    >
      <motion.path className="fill-timberwolf" d={svg} />
    </motion.svg>
  );
};

const LandingAnimation = () => {
  return (
    <div className="w-screen h-screen absolute top-0 left-0">
      <Shuttlecock />
    </div>
  );
};

export default LandingAnimation;

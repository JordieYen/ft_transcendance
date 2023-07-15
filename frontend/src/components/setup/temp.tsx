// import useUserStore from "@/store/useUserStore";
// import { motion } from "framer-motion";
// import { useState, useEffect, useRef } from "react";

// const Setup = () => {
//   const [animationComplete, isAnimationComplete] = useState(false);
//   const [inputValue, setInputValue] = useState<string>("");
//   const [previewPic, setPreviewPic] = useState<string>("");
//   const [selectedPic, setSelectedPic] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [userData, setUserData] = useUserStore((state) => [
//     state.userData,
//     state.setUserData,
//   ]);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/auth/profile", {
//           credentials: "include",
//         });
//         if (response.ok) {
//           const userData = await response.json();
//           setUserData(userData);
//           setInputValue(userData.username);
//           setPreviewPic(userData.avatar);
//           setSelectedPic(userData.avatar);
//         } else {
//           throw new Error("User not found");
//         }
//       } catch (error) {
//         console.log("Error fetching user data:", error);
//       }
//     };
//     fetchUserData();
//   }, []);

//   return (
//     <div className="w-screen h-screen items-center justify-start overflow-hidden">
//       <motion.div
//         className="flex flex-col items-center justify-start"
//         initial={{ y: "-100vh" }}
//         animate={{ y: "0vh" }}
//         transition={{ ease: "easeInOut", duration: 1 }}
//         // exit={{ y: "-100vh" }}
//       >
//         <div className="w-[360px] h-[700px] top-0 bg-jetblack border-2 border-saffron border-b-transparent">
//           {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-onyxgrey h-[100px] w-[360px] border-transparent border-t-jetblack border-b-0 border-l-[180px] border-r-[180px] border-t-[100px]"></div> */}
//           <p>Hello world</p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Setup;

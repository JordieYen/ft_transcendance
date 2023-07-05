import useAnimateStore from "@/store/useAnimateStore";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
import { interpolate } from "flubber";
import useUserStore from "@/store/useUserStore";
import toast from "react-hot-toast";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const Setup = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const shuttlecock =
    "M349 64c-36 0-76.4 15.8-108.8 48.2S192 184.9 192 221c0 28.2 9.6 53.2 27.7 71.3c40.4 40.4 120.7 38.9 180.1-20.5C432.2 239.4 448 199.1 448 163c0-28.2-9.6-53.2-27.7-71.3S377.1 64 349 64zm-154 2.9C238.5 23.4 294.8 0 349 0c42.8 0 84.9 14.8 116.6 46.5S512 120.2 512 163c0 54.2-23.4 110.5-66.9 154c-54.4 54.4-131.9 78.7-198.2 61.7c-29.4-7.5-62.9-5.5-84.3 16L148.3 409c6.4 12.1 4.5 27.4-5.6 37.6l-56 56c-12.5 12.5-32.8 12.5-45.3 0l-32-32c-12.5-12.5-12.5-32.8 0-45.3l56-56c10.2-10.2 25.5-12.1 37.6-5.6l14.5-14.5c21.4-21.4 23.5-54.7 16-84C129.8 250.9 128 236 128 221c0-54.2 23.4-110.5 66.9-154z";
  const [startMorph, setStartMorph] = useState(false);
  const [morphComplete, setMorphComplete] = useState(false);
  const progress = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [previewPic, setPreviewPic] = useState<string>("");
  const [selectedPic, setSelectedPic] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);
  const [currentStep, currentPage, setCurrentStep, setCurrentPage] =
    useAnimateStore((state) => [
      state.currentStep,
      state.currentPage,
      state.setCurrentStep,
      state.setCurrentPage,
    ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/profile", {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
          setInputValue(userData.username);
          console.log(userData.avatar);
          setPreviewPic(userData.avatar);
          setSelectedPic(userData.avatar);
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (startMorph) {
      const animation = animate(progress, 1, {
        duration: 0.5,
        ease: "easeInOut",
        onComplete: () => {
          setMorphComplete(true);
        },
      });

      return () => animation.stop();
    }
  }, [startMorph]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleNameUpdate = (inputValue: string) => {
    if (inputValue === "") {
      toast.error("Failed to change name: Name is not allowed to be empty!");
    } else {
      const updateUserDto = {
        username: inputValue,
      };
      axios
        .patch(`/users/${userData?.id}`, updateUserDto)
        .then(() => {
          setUserData({ ...userData, username: inputValue });
          setCurrentStep("avatar");
        })
        .catch(() => {
          console.log("update name failed!");
        });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCustomButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null && event.target.files.length !== 0) {
      const file = event.target.files[0];
      setSelectedPic(file);
      if (file) {
        const imageURL = URL.createObjectURL(file);
        setPreviewPic(imageURL);
      }
    }
  };

  const handlePicUpload = () => {
    if (selectedPic) {
      const formData = new FormData();
      formData.append("file", selectedPic);
      if (userData.id !== null) formData.append("id", userData.id?.toString());
      axios
        .patch("users/upload", formData)
        .then((response) => {
          setUserData({
            ...userData,
            avatar: response.data.avatarURL,
          });
        })
        .catch(() => {
          console.log("error upload avatar");
        });
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center overflow-hidden">
      {currentStep === "start" && (
        <motion.div
          className="flex flex-col items-center justify-center"
          animate={{ y: "-100vh" }}
          transition={{ ease: "easeIn", delay: 2, duration: 1.5 }}
          onAnimationComplete={() => {
            setCurrentStep("name"), setIsVisible(true);
          }}
        >
          <Image
            className="object-contain"
            src="/main-logo.svg"
            alt="Logo"
            width={240}
            height={176}
          />
          <p className="text-5xl font-pmarker text-timberwolf">Pongmington</p>
        </motion.div>
      )}
      <AnimatePresence mode="wait">
        <div key={currentStep}>
          {isVisible && currentStep === "name" && (
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ y: "100vh" }}
              animate={{ y: "0vh" }}
              transition={{ ease: "easeInOut", duration: 1.5 }}
              exit={{ y: "-100vh" }}
            >
              <div className="w-[400px] border-dashed border-2 border-dimgrey rounded-3xl shadow-xl shadow-jetblack px-10 py-8">
                <h2>
                  <p className="text-2xl text-timberwolf">Name</p>
                </h2>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  className="w-full my-3 rounded-md px-2 py-1 bg-dimgrey text-timberwolf text-xl font-roboto outline-none caret-saffron"
                />
                <button
                  className="flex w-full rounded-md px-2 py-1 bg-jetblack justify-center"
                  onClick={() => handleNameUpdate(inputValue)}
                >
                  <p className="text-xl text-timberwolf">Confirm</p>
                </button>
              </div>
            </motion.div>
          )}
          {isVisible && currentStep === "avatar" && (
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ y: "100vh" }}
              animate={{ y: "0vh" }}
              transition={{ ease: "easeInOut", duration: 1.5 }}
              onAnimationComplete={() => setStartMorph(true)}
              exit={{ y: "-100vh" }}
            >
              <div className="w-[400px] border-dashed border-2 border-dimgrey rounded-3xl shadow-xl shadow-jetblack px-10 py-8">
                <h2>
                  <p className="text-2xl text-timberwolf">Avatar</p>
                </h2>

                <div className="flex flex-col my-3 py-1 items-center justify-center avatar-preview w-full">
                  {morphComplete ? (
                    <div
                      className="group cursor-pointer w-48 h-48"
                      onClick={handleCustomButtonClick}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img
                        width={400}
                        height={400}
                        className="w-48 h-48 rounded-full object-cover bg-jetblack group-hover:opacity-20"
                        src={previewPic}
                        alt="update avatar"
                      />
                      <FontAwesomeIcon
                        icon={faCamera}
                        size="2xl"
                        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-dimgrey transition-opacity ${
                          isHovered
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-jetblack rounded-full">
                      <motion.svg
                        className="absolute w-20 h-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-dimgrey"
                        // xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        initial={{ path: shuttlecock }}
                        // animate={{ path: "M50 50l-50 50h100z" }}
                        animate={{ path: interpolate(shuttlecock, "M0 0") }}
                      >
                        <motion.path d={shuttlecock} />
                      </motion.svg>
                    </div>
                  )}

                  <input
                    id="file-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePicChange}
                    className="hidden"
                  />
                </div>

                <button
                  className="flex w-full rounded-md px-2 py-1 bg-jetblack justify-center"
                  onClick={() => handlePicUpload()}
                >
                  <p className="text-xl text-timberwolf">Confirm</p>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default Setup;

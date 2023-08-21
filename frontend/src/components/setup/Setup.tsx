import useAnimateStore from "@/store/useAnimateStore";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import useUserStore from "@/store/useUserStore";
import toast from "react-hot-toast";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import SixDigitVerification from "../user-settings/SixDigitVerification";
import QRCode from "qrcode";
import { useRouter } from "next/router";

const LogoStep = () => {
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
    const timeout = setTimeout(() => {
      if (userData.firstTimeLogin === true) {
        setCurrentStep("name");
      } else {
        setCurrentStep("end");
      }
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      initial={{ y: "0vh" }}
      exit={{ y: "-100vh" }}
      transition={{ ease: "easeInOut", duration: 1.5 }}
    >
      <Image
        className="object-contain"
        src="/main-logo.svg"
        alt="Logo"
        width={240}
        height={176}
        style={{ width: "100%", height: "auto" }}
        priority={true}
      />
      <p className="text-5xl font-pmarker text-timberwolf">Pongmington</p>
    </motion.div>
  );
};

const NameStep = () => {
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

  const [showName, setShowName] = useState(false);
  const [inputValue, setInputValue] = useState<string>(userData.username);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleNameUpdate = (inputValue: string) => {
    if (inputValue === "") {
      toast.error("Failed to change name: Name is not allowed to be empty!");
    } else if (inputValue.length < 3) {
      toast.error(
        "Failed to change name: Name must contain at least 3 characters",
      );
    } else {
      const updateUserDto = {
        username: inputValue,
      };
      axios
        .patch(`/users/${userData?.id}`, updateUserDto, {
          withCredentials: true,
        })
        .then(() => {
          setUserData({ ...userData, username: inputValue });
          setCurrentStep("avatar");
        })
        .catch((error) => {
          if (error.response) {
            const { data, status } = error.response;
            if (data.message === "Username already exists") {
              toast.error("Failed to change name: Name is already taken!");
            }
          } else {
            toast.error("Name update failed! Please try again later");
          }
        });
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      initial={{ y: "100vh" }}
      animate={{ y: "0vh" }}
      transition={{ ease: "easeInOut", duration: 1.5 }}
      onAnimationComplete={() => {
        setTimeout(() => {
          setShowName(true);
        }, 2200);
      }}
      exit={{ y: "-100vh" }}
    >
      <div className="w-[500px] h-fit items-center justify-start">
        <div className="flex w-full h-full items-center justify-start">
          {showName ? (
            <div className="flex flex-col w-full h-full border-dashed border-2 border-dimgrey rounded-3xl shadow-xl shadow-jetblack px-10 py-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-roboto text-timberwolf">Name</h2>
                <p className="text-md text-dimgrey">
                  Name must contain more than 3 characters.
                </p>
              </motion.div>
              <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                className="w-full my-3 rounded-md px-2 py-1 bg-dimgrey text-timberwolf text-xl font-roboto outline-none caret-saffron"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  className="flex w-full rounded-md px-2 py-1 bg-jetblack justify-center"
                  onClick={() => handleNameUpdate(inputValue)}
                >
                  <p className="text-xl text-timberwolf">Confirm</p>
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="flex flex-col w-full h-full px-10 py-8">
              <h2 className="text-2xl font-roboto text-onyxgrey">Name</h2>
              <div className="flex w-full h-9 my-3 rounded-md px-2 py-1">
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{
                    delay: 2.5,
                    ease: "easeInOut",
                    duration: 0.2,
                  }}
                >
                  <p className="text-xl text-timberwolf">Hi,&nbsp;</p>
                </motion.div>
                <motion.div
                  animate={{ x: -47 }}
                  transition={{
                    delay: 2.5,
                    ease: "easeInOut",
                    duration: 1,
                  }}
                >
                  <p className="text-xl text-timberwolf">{userData.username}</p>
                </motion.div>
              </div>
              <div className="w-full px-2 py-1 justify-center">
                <p className="text-xl text-timberwolf hidden">Confirm</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const AvatarStep = () => {
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

  const [previewPic, setPreviewPic] = useState<string>(userData.avatar);
  const [selectedPic, setSelectedPic] = useState<File | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!selectedPic) {
      setCurrentStep("tfa");
    }
    if (selectedPic) {
      const formData = new FormData();
      formData.append("file", selectedPic);
      if (userData.id !== null) formData.append("id", userData.id?.toString());
      axios
        .patch("users/upload", formData, {
          withCredentials: true,
        })
        .then((response) => {
          setUserData({
            ...userData,
            avatar: response.data.avatarURL,
          });
          setCurrentStep("tfa");
        })
        .catch((error) => {
          if (error.response) {
            const { data, status } = error.response;
            if (status === 422) {
              toast.error(
                "Failed to change avatar: File size must not be more than 4MB!",
              );
            } else {
              toast.error("Avatar update failed! Please try again later");
            }
          }
        });
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      initial={{ y: "100vh" }}
      animate={{ y: "0vh" }}
      transition={{ ease: "easeInOut", duration: 1.5 }}
      exit={{ y: "-100vh" }}
    >
      <div className="w-[360px] border-dashed border-2 border-dimgrey rounded-3xl shadow-xl shadow-jetblack px-10 py-8">
        <h2 className="text-2xl font-roboto text-timberwolf">Avatar</h2>
        <p className="text-md text-dimgrey">File size should not exceed 4MB.</p>
        <div className="flex flex-col my-3 py-1 items-center justify-center avatar-preview w-full">
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
                isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            />
          </div>
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
  );
};

const TFAStep = () => {
  const [isShuttlecockEnd, setIsShuttlecockEnd] = useState(false);
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

  const [setupTFA, isSetupTFA] = useState(false);
  const [qrCodeImg, setQRCodeImg] = useState("");

  const x = useMotionValue(0);
  const xInput = [-100, 0, 100];
  const background = useTransform(x, xInput, [
    "linear-gradient(90deg, #ff008c 0%, rgb(211, 9, 225) 100%)",
    "linear-gradient(90deg, #323437 100%, #323437 100%)",
    "linear-gradient(90deg, rgb(230, 255, 0) 0%, rgb(3, 209, 0) 100%)",
  ]);
  const color = useTransform(x, xInput, [
    "rgb(211, 9, 225)",
    "rgb(50, 52, 55)",
    "rgb(3, 209, 0)",
  ]);

  const tickPath = useTransform(x, [10, 60], [0, 1]);
  const crossPathA = useTransform(x, [-10, -35], [0, 1]);
  const crossPathB = useTransform(x, [-35, -60], [0, 1]);

  useEffect(() => {
    const unsubscribe = x.on("change", (currentX) => {
      const leftConstraint = -64;
      const rightConstraint = 64;

      if (currentX <= leftConstraint) {
        setFirstTimeLogin();
        setCurrentStep("end");
      } else if (currentX >= rightConstraint) {
        isSetupTFA(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [x]);

  useEffect(() => {
    if (isShuttlecockEnd === true) {
      const timeout = setTimeout(() => {
        setCurrentPage("main");
      }, 3000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isShuttlecockEnd]);

  useEffect(() => {
    const fetchQRCodeData = async () => {
      try {
        const response = await axios.get("/auth/2fa", {
          withCredentials: true,
        });
        const qrCodeUrl = response.data;

        const canvas = document.createElement("canvas");
        await QRCode.toCanvas(canvas, qrCodeUrl);
        const qrCodeImageData = canvas.toDataURL();

        setQRCodeImg(qrCodeImageData);
      } catch (error) {
        toast.error("Failed to generate QR code! Please try again later");
      }
    };

    if (setupTFA === true) fetchQRCodeData();
  }, [setupTFA]);

  const setFirstTimeLogin = () => {
    const updateUserDto = {
      firstTimeLogin: false,
    };
    axios
      .patch(`/users/${userData?.id}`, updateUserDto, {
        withCredentials: true,
      })
      .then(() => {
        setUserData({ ...userData, firstTimeLogin: false });
      })
      .catch(() => {
        toast.error("Failed to update 2FA! Please try again");
      });
    setIsShuttlecockEnd(true);
  };

  const patchTFA = () => {
    axios
      .post("/users/authenticate", null, {
        params: { 
          uid: userData?.id?.toString() 
        },
        withCredentials: true,
      })
      .then(() => {
        setUserData({
          ...userData,
          authentication: true,
        });
        setCurrentStep("end");
        setFirstTimeLogin();
      })
      .catch(() => {
        toast.error("Failed to update 2FA! Please try again");
      });
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-4"
      initial={{ y: "100vh" }}
      animate={{ y: "0vh" }}
      transition={{ ease: "easeInOut", duration: 1.5 }}
      exit={{ y: "-100vh" }}
    >
      <motion.div className="flex flex-col w-[300px] items-center justify-center border-dashed border-2 border-dimgrey rounded-3xl shadow-xl shadow-jetblack px-10 py-8">
        <h2 className="flex w-full justify-start text-2xl font-roboto text-timberwolf">
          Activate 2FA
        </h2>
        <div className="w-[180px] h-[50px] my-3 items-center justify-center">
          <motion.div
            className="w-full h-full rounded-full border-[1px] border-dimgrey items-center justify-center"
            style={{ background, height: 50 }}
          >
            <motion.div
              className="flex absolute w-[50px] h-[50px] bg-timberwolf rounded-full items-center justify-center"
              style={{
                x,
                left: "calc(50% - 25px)",
              }}
              drag="x"
              dragConstraints={{ left: -65, right: 65 }}
            >
              <svg className="w-[95%] h-[95%]" viewBox="0 0 50 50">
                <motion.path
                  fill="none"
                  strokeWidth="2"
                  stroke={color}
                  d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
                  style={{ translateX: 5, translateY: 5 }}
                />
                <motion.path
                  fill="none"
                  strokeWidth="2"
                  stroke={color}
                  d="M14,26 L 22,33 L 35,16"
                  strokeDasharray="0 1"
                  style={{ pathLength: tickPath }}
                />
                <motion.path
                  fill="none"
                  strokeWidth="2"
                  stroke={color}
                  d="M17,17 L33,33"
                  strokeDasharray="0 1"
                  style={{ pathLength: crossPathA }}
                />
                <motion.path
                  fill="none"
                  strokeWidth="2"
                  stroke={color}
                  d="M33,17 L17,33"
                  strokeDasharray="0 1"
                  style={{ pathLength: crossPathB }}
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      {setupTFA && (
        <motion.div
          className="flex flex-col w-[500px] h-fit border-2 border-dimgrey rounded-3xl shadow-xl shadow-jetblack p-8 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, ease: "easeIn", duration: 0.5 }}
        >
          <p className="text-md text-dimgrey">
            Scan this QR Code with your Authenticator App and enter the
            verification code below.
          </p>
          <div className="flex rounded-lg border-[3px] border-saffron bg-white items-center justify-center">
            {qrCodeImg ? (
              <Image
                src={qrCodeImg}
                alt="2FA QR Code"
                width={150}
                height={150}
              />
            ) : (
              <p>Loading QR Code...</p>
            )}
          </div>
          <hr className="border-dimgrey"></hr>
          <p className="text-md">Verification Code:</p>
          <SixDigitVerification
            closeModal={undefined}
            verifiedAction={() => patchTFA()}
            mode="1"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

const Setup = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NEST_HOST}/auth/profile`,
          {
            credentials: "include",
          },
        );
        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
          setCurrentPage("setup");
          setCurrentStep("start");
          setIsVisible(true);
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      {isVisible && (
        <AnimatePresence
          mode="wait"
          onExitComplete={
            currentStep === "end" ? () => router.push("main-menu") : undefined
          }
        >
          <div
            key={currentStep}
            className="flex flex-col w-screen h-screen relative items-center justify-center overflow-hidden"
          >
            {currentStep === "start" && <LogoStep />}
            {currentStep === "name" && <NameStep />}
            {currentStep === "avatar" && <AvatarStep />}
            {currentStep === "tfa" && <TFAStep />}
          </div>
        </AnimatePresence>
      )}
    </>
  );
};

export default Setup;

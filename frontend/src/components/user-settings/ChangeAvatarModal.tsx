import React, { useState, useEffect, useRef, RefObject } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import useUserStore from "@/store/useUserStore";
import SixDigitVerification from "./SixDigitVerification";

interface ChangeAvatarModalProps {
  isOpen: boolean;
  closeModal: () => void;
  picRef: RefObject<HTMLDivElement>;
}

const ChangeAvatarModal = ({
  isOpen,
  closeModal,
  picRef,
}: ChangeAvatarModalProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedPic, setSelectedPic] = useState<File | null>(null);
  const [previewPic, setPreviewPic] = useState<string>("");
  const [promptTFA, setPromptTFA] = useState(false);
  const [isPicUpdated, setIsPicUpdated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

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

  const patchAvatar = () => {
    const formData = new FormData();
    formData.append("file", selectedPic!);
    if (userData.id !== null) formData.append("id", userData.id?.toString());
    axios
      .patch("users/upload", formData, { withCredentials: true })
      .then((response) => {
        closeModal();
        setUserData({
          ...userData,
          avatar: response.data.avatarURL,
        });
        toast.success("Avatar successfully updated!");
      })
      .catch((error) => {
        closeModal();
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
    setSelectedPic(null);
    setPreviewPic("");
  };

  const handlePicUpload = () => {
    if (!selectedPic)
      toast.error("Failed to change avatar: No new image detected!");
    if (selectedPic) {
      if (userData.authentication === true) {
        setPromptTFA(true);
      }
      if (userData.authentication === false) {
        patchAvatar();
      }
    }
  };

  useEffect(() => {
    if (isOpen === false) setSelectedPic(null);
    setIsPicUpdated(false);
    setSelectedPic(null);
    setPreviewPic("");
    setPromptTFA(false);
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="overlay w-screen h-screen flex items-center justify-center bg-black/75 absolute top-0 left-0 z-20">
          <div
            className={`overlay-content ${
              promptTFA ? "w-[500px]" : "w-[400px]"
            } h-fit bg-onyxgrey rounded-2xl p-8 space-y-3`}
            ref={picRef}
          >
            <h2>
              <p className="text-2xl text-dimgrey">Change avatar</p>
            </h2>
            {promptTFA ? (
              <div>
                <p className="text-dimgrey text-md">
                  It seems like you have 2FA activated.
                </p>
                <p className="text-dimgrey text-md mb-4">
                  Please input 6 digit OTP code from your authenticar app.
                </p>
                <SixDigitVerification
                  closeModal={closeModal}
                  verifiedAction={() => patchAvatar()}
                  mode={"2"}
                />
              </div>
            ) : (
              <>
                <p className="text-md text-dimgrey">
                  File size should not exceed 4MB.
                </p>
                <div className="flex flex-col mb-3 py-1 items-center justify-center">
                  <div
                    className="avatar-preview w-40 h-40 bg-jetblack rounded-full"
                    onClick={handleCustomButtonClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {previewPic ? (
                      <div className="group cursor-pointer">
                        <Image
                          width={400}
                          height={400}
                          className="w-40 h-40 rounded-full object-cover group-hover:opacity-20"
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
                      <div className="w-40 h-40 rounded-full bg-jetblack relative cursor-pointer">
                        <FontAwesomeIcon
                          icon={faCamera}
                          size="2xl"
                          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-dimgrey transition-opacity ${
                            isHovered
                              ? "opacity-100"
                              : "opacity-20 group-hover:opacity-100"
                          }`}
                        />
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
                </div>
                <button
                  className="flex w-full rounded-md px-2 py-1 bg-jetblack justify-center"
                  onClick={() => handlePicUpload()}
                >
                  <p className="text-xl text-timberwolf">Update</p>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChangeAvatarModal;

import React, { useState, useEffect, useRef, RefObject } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import useUserStore from "@/store/useUserStore";

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
    // Trigger hidden file input button element
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    /* The first  */
    const file = event.target.files?.[0] ?? null;
    setSelectedPic(file);
    if (file) {
      const imageURL = URL.createObjectURL(file);
      // setPreviewPic(URL.createObjectURL(file));
      setPreviewPic(imageURL);
    }
  };

  const handlePicUpload = () => {
    if (!selectedPic)
      toast.error("Failed to change avatar: No new image detected!");
    if (selectedPic) {
      closeModal();
      const formData = new FormData();
      formData.append("file", selectedPic);
      if (userData.id !== null) formData.append("id", userData.id?.toString());
      axios
        .patch("users/upload", formData)
        .then((response) => {
          console.log(response.data);
          setUserData({
            ...userData,
            avatar: response.data.avatarURL,
          });
          toast.success("Avatar successfully updated!");
        })
        .catch(() => {
          toast.error("Avatar update failed! Please try again later");
        });
      setSelectedPic(null);
      setPreviewPic("");
    }
  };

  useEffect(() => {
    if (isOpen === false) setSelectedPic(null);
    setIsPicUpdated(false);
    setSelectedPic(null);
    setPreviewPic("");
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="overlay w-screen h-screen flex items-center justify-center bg-black/75 absolute top-0">
          <div
            className="overlay-content w-[400px] h-fit bg-onyxgrey rounded-2xl p-8"
            ref={picRef}
          >
            <h2>
              <p className="text-2xl text-dimgrey">Change avatar</p>
            </h2>
            <div className="flex flex-col my-3 py-1 items-center justify-center">
              <div
                className="avatar-preview w-40 h-40 bg-jetblack rounded-full"
                onClick={handleCustomButtonClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {previewPic ? (
                  <Image
                    width={400}
                    height={400}
                    className="w-40 h-40 rounded-full object-cover"
                    src={previewPic}
                    alt="update avatar"
                  />
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
                {/*
                  <label
                    htmlFor="file-upload"
                    className="custom-file-button absolute bottom-4 left-1/2 transform -translate-x-1/2 py-2 px-4 bg-white border border-gray-300 rounded cursor-pointer"
                  >
                    Upload
                  </label>
                */}
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
          </div>
        </div>
      )}
    </>
  );
};

export default ChangeAvatarModal;

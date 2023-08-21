import useUserStore from "@/store/useUserStore";
import React, { useState, useEffect, RefObject } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import SixDigitVerification from "./SixDigitVerification";

interface ChangeAccountModalProps {
  isOpen: boolean;
  closeModal: () => void;
  accRef: RefObject<HTMLDivElement>;
}

const ChangeAccountModal = ({
  isOpen,
  closeModal,
  accRef,
}: ChangeAccountModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [promptTFA, setPromptTFA] = useState(false);
  const [isNameUpdated, setIsNameUpdated] = useState(false);
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const patchName = () => {
    const updateUserDto = {
      username: inputValue,
    };
    axios
      .patch(`/users/${userData?.id}`, updateUserDto, { withCredentials: true })
      .then(() => {
        setUserData({ ...userData, username: inputValue });
        closeModal();
        setIsNameUpdated(true);
        toast.success("Name successfully updated!");
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
  };

  const handleNameUpdate = (inputValue: string) => {
    if (inputValue === "") {
      toast.error("Failed to change name: Name is not allowed to be empty!");
    } else if (inputValue.length < 3) {
      toast.error(
        "Failed to change name: Name must contain at least 3 characters",
      );
    } else {
      if (userData.authentication === true) {
        setPromptTFA(true);
      }
      if (userData.authentication === false) {
        patchName();
      }
    }
  };

  useEffect(() => {
    if (isOpen === false) setInputValue("");
    setIsNameUpdated(false);
    setPromptTFA(false);
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="overlay w-screen h-screen flex items-center justify-center bg-black/75 absolute top-0 z-20">
          <div
            className="overlay-content h-fill w-[500px] bg-onyxgrey rounded-2xl p-8 space-y-3"
            ref={accRef}
          >
            <h2>
              <p className="text-2xl text-dimgrey mb-3">Update name</p>
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
                  verifiedAction={() => patchName()}
                  mode={"2"}
                />
              </div>
            ) : (
              <>
                <p className="text-md text-dimgrey">
                  Name must contain more than 3 characters.
                </p>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  placeholder="New name"
                  className="w-full mb-3 rounded-md px-2 py-1 bg-jetblack placeholder-dimgrey text-xl text-timberwolf outline-none caret-saffron"
                />
                <button
                  className="flex w-full rounded-md px-2 py-1 bg-jetblack justify-center"
                  onClick={() => handleNameUpdate(inputValue)}
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

export default ChangeAccountModal;

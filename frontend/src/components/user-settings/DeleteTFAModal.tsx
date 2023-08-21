import React, { useState, useEffect, RefObject } from "react";
import axios from "axios";
import useUserStore from "@/store/useUserStore";
import toast from "react-hot-toast";
import SixDigitVerification from "./SixDigitVerification";

interface DeleteTFAModalProps {
  isOpen: boolean;
  closeModal: () => void;
  tfaRef: RefObject<HTMLDivElement>;
}

const DeleteTFAModal = ({
  isOpen,
  closeModal,
  tfaRef,
}: DeleteTFAModalProps) => {
  const [promptTFA, setPromptTFA] = useState(false);
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  const handleButton = () => {
    if (userData.authentication === true) {
      setPromptTFA(true);
    } else {
      handleDeleteTFA();
    }
  };

  const handleDeleteTFA = () => {
    const updateUserDto = {
      authentication: false,
      authenticationString: "",
    };
    axios
      .patch(`/users/${userData?.id}`, updateUserDto, { withCredentials: true })
      .then(() => {
        setUserData({
          ...userData,
          authentication: false,
          authenticationString: "",
        });
        closeModal();
        toast.success("2FA successfully unlinked");
      })
      .catch(() => {
        toast.error("2FA unlink failed! Please try again later");
      });
  };

  useEffect(() => {
    setPromptTFA(false);
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="overlay w-screen h-screen flex items-center justify-center bg-black/75 absolute top-0 z-20">
          <div
            className={`flex flex-col overlay-content ${
              promptTFA ? "w-[500px] h-fill" : "w-[400px] h-fit"
            } bg-onyxgrey rounded-2xl p-8 space-y-3`}
            ref={tfaRef}
          >
            <h2>
              <p className="text-2xl text-dimgrey">Unlink 2FA</p>
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
                  verifiedAction={() => handleDeleteTFA()}
                  mode={"2"}
                />
              </div>
            ) : (
              <div className="flex w-full space-x-2">
                <button
                  className="w-full rounded-md px-2 py-2 bg-jetblack border-2 border-saffron justify-center"
                  onClick={() => handleButton()}
                >
                  <p className="text-lg text-timberwolf">Confirm</p>
                </button>
                <button
                  className="w-full rounded-md px-2 py-2 bg-jetblack border-2 border-dimgrey justify-center"
                  onClick={() => closeModal()}
                >
                  <p className="text-lg text-timberwolf">Cancel</p>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteTFAModal;

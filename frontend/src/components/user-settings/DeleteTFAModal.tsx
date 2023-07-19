import React, { useState, useEffect, RefObject } from "react";
import axios from "axios";
import useUserStore from "@/store/useUserStore";
import toast from "react-hot-toast";

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
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  const handleDeleteTFA = () => {
    const updateUserDto = {
      authentication: false,
      authenticationString: "",
    };
    axios
      .patch(`/users/${userData?.id}`, updateUserDto)
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

  return (
    <>
      {isOpen && (
        <div className="overlay w-screen h-screen flex items-center justify-center bg-black/75 absolute top-0">
          <div
            className="flex flex-col overlay-content w-[400px] h-fit bg-onyxgrey rounded-2xl p-8 space-y-3"
            ref={tfaRef}
          >
            <h2>
              <p className="text-2xl text-dimgrey">Unlink 2FA</p>
            </h2>
            <div className="flex w-full space-x-2">
              <button
                className="w-full rounded-md px-2 py-2 bg-jetblack border-2 border-saffron justify-center"
                onClick={() => handleDeleteTFA()}
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
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteTFAModal;

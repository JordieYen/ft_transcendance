import React, { useState, useEffect, RefObject } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import useUserStore from "@/store/useUserStore";

interface DeleteAccountModalProps {
  isOpen: boolean;
  closeModal: () => void;
  delRef: RefObject<HTMLDivElement>;
}

const DeleteAccountModal = ({
  isOpen,
  closeModal,
  delRef,
}: DeleteAccountModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleDeleteAccount = (inputValue: string) => {
    if (inputValue !== "DELETE") {
      toast.error("Failed to delete account: string does not match!");
    } else {
      closeModal();
      axios
        .delete(`users/${userData?.id}`)
        .then(() => {
          router.push("/login").then(() => {
            toast((t) => (
              <div className="flex flex-1 items-center justify-start">
                <div className="flex flex-col items-center justify-center text-timberwolf">
                  <FontAwesomeIcon icon={faTrash} size="lg" />
                </div>
                <div className="mx-[10px] my-1">
                  <p className="text-timberwolf font-roboto text-base">
                    Delete successful
                  </p>
                </div>
              </div>
            ));
          });
        })
        .catch(() => {
          toast.error("Delete failed! Please try again later");
        });
    }
  };

  useEffect(() => {
    if (isOpen === false) setInputValue("");
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="overlay w-screen h-screen flex items-center justify-center bg-black/75 absolute top-0">
          <div
            className="overlay-content w-[400px] h-fit bg-onyxgrey rounded-2xl p-8"
            ref={delRef}
          >
            <h2 className="flex flex-col">
              <p className="text-2xl text-dimgrey">Delete account</p>
              <p className="text-lg text-tomato">
                This action is not reversible! All will be lost!
              </p>
            </h2>
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="type DELETE to confirm"
              className="w-full my-3 rounded-md px-2 py-1 bg-jetblack placeholder-dimgrey font-roboto text-xl text-timberwolf outline-none caret-saffron"
            />
            <button
              className="flex w-full rounded-md px-2 py-1 bg-jetblack justify-center"
              onClick={() => handleDeleteAccount(inputValue)}
            >
              <p className="text-xl text-timberwolf">Delete account</p>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccountModal;

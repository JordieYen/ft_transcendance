import React, { useState, useEffect, RefObject } from "react";
import toast from "react-hot-toast";

interface ChangeTFAModalProps {
  isOpen: boolean;
  closeModal: () => void;
  tfaRef: RefObject<HTMLDivElement>;
}

const ChangeTFAModal = ({
  isOpen,
  closeModal,
  tfaRef,
}: ChangeTFAModalProps) => {
  return (
    <div>
      {isOpen && (
        <div className="overlay w-screen h-screen flex items-center justify-center bg-black/75 absolute top-0">
          <h2>
            <p className="text-2xl text-dimgrey">Update 2FA</p>
          </h2>
        </div>
      )}
    </div>
  );
};

export default ChangeTFAModal;

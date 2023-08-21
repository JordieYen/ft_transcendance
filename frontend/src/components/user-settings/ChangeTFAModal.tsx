import React, { useState, useEffect, RefObject } from "react";
import Image from "next/image";
import axios from "axios";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import SixDigitVerification from "./SixDigitVerification";
import useUserStore from "@/store/useUserStore";

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
  const [qrCodeImg, setQRCodeImg] = useState("");
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

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

    if (isOpen === true) fetchQRCodeData();
  }, [isOpen]);

  const patchTFA = () => {
    closeModal();
    toast.success("Authentication success!");
    axios
      .post("/users/authenticate", null, {
        params: { uid: userData?.id?.toString() },
        withCredentials: true,
      })
      .then(() => {
        setUserData({
          ...userData,
          authentication: true,
        });
      })
      .catch(() => {
        toast.error("Failed to update 2FA. Please try again later");
      });
  };

  return (
    <>
      {isOpen && (
        <div className="overlay w-screen h-screen flex items-center justify-center bg-black/75 absolute top-0 left-0 z-20">
          <div
            className="overlay-content w-[500px] h-fit flex flex-col bg-onyxgrey rounded-2xl p-8 space-y-3"
            ref={tfaRef}
          >
            <h2>
              <p className="text-2xl text-dimgrey">Update 2FA</p>
            </h2>
            <p className="text-md text-dimgrey">
              Two factor authentication adds an extra layer of security to your
              account. Scan this QR Code with your Authenticator App and enter
              the verification code below.
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
              closeModal={closeModal}
              verifiedAction={() => patchTFA()}
              mode={"1"}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChangeTFAModal;

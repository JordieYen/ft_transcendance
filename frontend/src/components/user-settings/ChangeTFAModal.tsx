import React, { useState, useEffect, useRef, RefObject } from "react";
import axios from "axios";
import QRCode from "qrcode";
import toast from "react-hot-toast";

export const SixDigitVerification = () => {
  const [verCode, setVerCode] = useState(["", "", "", "", "", ""]);
  const [isCodeComplete, setIsCodeComplete] = useState(false);
  const verInput = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    verInput.current[0].focus();
  }, []);

  useEffect(() => {
    const completed = verCode.every((digit) => digit !== "");
    console.log(completed);
    setIsCodeComplete(completed);
  }, [verCode]);

  const handleInputMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    let index = 0;
    for (let i = 0; i < 5; i++) {
      if (verCode[i] !== "") index = i;
    }
    if (index === 0 && verCode[0] === "") verInput.current[index].focus();
    else verInput.current[index + 1].focus();

    event.preventDefault();
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = event.target;
    if (/^\d+$/.test(value) || value === "") {
      const newVerCode = [...verCode];
      newVerCode[index] = value;
      setVerCode(newVerCode);

      // Focus on the next input box
      if (value !== "" && index < 5) {
        verInput.current[index + 1].focus();
      }
    }
  };

  const handleInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && index > 0 && verCode[index] === "") {
      event.preventDefault(); //Prevent default backspace behavior
      const newVerCode = [...verCode];
      newVerCode[index - 1] = ""; //Clear the latest number
      setVerCode(newVerCode);
      verInput.current[index - 1].focus(); //Focus on the previous input box
    }
  };

  const handleVerSubmit = () => {
    console.log("Verification code submitted:", verCode.join(""));
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex space-x-4">
        {verCode.map((digit, index) => (
          <input
            className={`w-[59px] h-[59px] border-2 rounded-xl outline-none bg-transparent font-roboto text-timberwolf text-xl text-center ${
              digit ? `border-saffron` : `border-dimgrey`
            }`}
            key={index}
            type="string"
            value={digit}
            onChange={(event) => handleInputChange(event, index)}
            onKeyDown={(event) => handleInputKeyDown(event, index)}
            onMouseDown={handleInputMouseDown}
            ref={(input) =>
              (verInput.current[index] = input as HTMLInputElement)
            }
            maxLength={1}
            autoFocus={index === 0}
          />
        ))}
      </div>
      <button
        className="flex w-full rounded-md px-2 py-1 bg-jetblack justify-center"
        disabled={!isCodeComplete}
        onClick={handleVerSubmit}
      >
        <p
          className={`text-xl ${
            isCodeComplete ? "text-timberwolf" : "text-dimgrey"
          }`}
        >
          Submit
        </p>
      </button>
    </div>
  );
};

// <HTMLInputElement[]>

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

  useEffect(() => {
    const fetchQRCodeData = async () => {
      try {
        const response = await axios.get("/auth/2fa", {
          withCredentials: true,
        });
        console.log(response);
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

  return (
    <div>
      {isOpen && (
        <div className="overlay w-screen h-screen flex items-center justify-center bg-black/75 absolute top-0">
          <div
            className="overlay-content w-[500px] h-fit flex flex-col bg-onyxgrey rounded-2xl p-8 space-y-3"
            ref={tfaRef}
          >
            <h2>
              <p className="text-2xl text-dimgrey">Update 2FA</p>
            </h2>
            <div className="flex flex-col space-y-1">
              <p className="text-sm text-dimgrey">
                Two factor authentication adds an extra layer of security to
                your account. Scan this QR Code with your Authenticator App and
                enter the verification code below.
              </p>
            </div>
            <div className="flex rounded-lg border-[3px] border-saffron bg-white items-center justify-center">
              {qrCodeImg ? (
                <img
                  className="w-[150px] h-[150px]"
                  src={qrCodeImg}
                  alt="2FA QR Code"
                />
              ) : (
                <p>Loading QR Code...</p>
              )}
            </div>
            <hr className="border-dimgrey"></hr>
            <p className="text-sm">Verification Code:</p>
            <SixDigitVerification />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeTFAModal;

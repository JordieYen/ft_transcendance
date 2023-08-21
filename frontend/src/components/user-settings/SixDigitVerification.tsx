import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const SixDigitVerification = ({
  closeModal,
  verifiedAction,
  mode,
}: {
  closeModal?: () => void;
  verifiedAction: () => void;
  mode: string;
}) => {
  const [verCode, setVerCode] = useState(["", "", "", "", "", ""]);
  const [isCodeComplete, setIsCodeComplete] = useState(false);
  const verInput = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    verInput.current[0].focus();
  }, []);

  useEffect(() => {
    const completed = verCode.every((digit) => digit !== "");
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

  const handleInputPaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("Text").trim();
    const newVerCode = [...verCode];
    const digits = pastedData.split("").slice(0, 6); // Limit to 6 digits if needed

    if (!/^\d+$/.test(pastedData.slice(0, 6)))
      toast.error("Paste error! Clipboard Data contains non-numerical values!");
    else {
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newVerCode[index + i] = digit;
        }
      });

      setVerCode(newVerCode);
      verInput.current[5].focus();
    }
  };

  const handleVerSubmit = () => {
    const otpCode = verCode.join("");
    console.log(otpCode);
    axios
      .post(
        `auth/otp?mode=${mode}`,
        { otp: otpCode },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        localStorage.setItem("token", response.data);
        verifiedAction();
      })
      .catch(() => {
        toast.error("Authentication failed!");
        verInput.current[5].focus();
      });
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex space-x-4">
        {verCode.map((digit, index) => (
          <input
            className={`border-2 w-[59px] h-[59px] rounded-xl outline-none caret-transparent bg-transparent font-roboto text-timberwolf text-2xl text-center ${
              digit ? `border-saffron` : `border-dimgrey`
            }`}
            key={index}
            type="string"
            value={digit}
            onChange={(event) => handleInputChange(event, index)}
            onKeyDown={(event) => handleInputKeyDown(event, index)}
            onMouseDown={handleInputMouseDown}
            onPaste={(event) => handleInputPaste(event, index)}
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

export default SixDigitVerification;

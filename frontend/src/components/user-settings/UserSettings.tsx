import React from "react";
import "@/styles/globals.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

type Mode = "button" | "select" | "option" | "toggle" | "2fadone";

interface UserSettingsProps {
  title: string;
  description: string;
  warning?: string;
  buttonDescArry: string[];
  handleClick: ((str: string) => void)[];
  mode: Mode;
  icon: IconDefinition;
}

const UserSettings = ({
  title,
  description,
  warning,
  buttonDescArry,
  handleClick,
  mode,
  icon,
}: UserSettingsProps) => {
  const renderRightContent = () => {
    return (
      <div className="w-[200px] md:w-[300px] lg:w-[400px] flex gap-2">
        {buttonDescArry.map((text, index) => (
          <button
            key={index}
            className={`w-full flex items-center justify-center bg-jetblack border-2 ${
              warning ? "border-tomato" : "border-saffron"
            } text-timberwolf font-roboto rounded-lg cursor-pointer p-2 mb-2`}
            onClick={() => handleClick[index](text)}
          >
            {text}
          </button>
        ))}
      </div>
    );
  };
  return (
    <div className="w-full px-32 flex items-center justify-center">
      <div className="flex-1">
        <p className="text-dimgrey mb-1">
          <FontAwesomeIcon icon={icon} className="pr-2" />
          {title}
        </p>
        <p>{description}</p>
        <p className="text-tomato">{warning}</p>
      </div>
      {renderRightContent()}
    </div>
  );
};

export default UserSettings;

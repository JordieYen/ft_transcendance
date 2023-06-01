import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

type Mode = "button" | "select" | "option" | "toggle";

interface SettingsComponentProps {
  title: string;
  description: string;
  warning?: string;
  buttonDescArry: string[];
  handleClick: (str: string) => void;
  mode: Mode;
  icon: IconDefinition;
}

const SettingsComponent = ({
  title,
  description,
  warning,
  buttonDescArry,
  handleClick,
  mode,
  icon,
}: SettingsComponentProps) => {
  const renderRightContent = () => {
    return (
      <div className="w-[400px] flex gap-2">
        {buttonDescArry.map((text, index) => (
          <button
            className={`w-full flex items-center justify-center bg-jetblack border-2 ${
              warning ? "border-tomato" : "border-saffron"
            } text-timberwolf font-roboto rounded-lg cursor-pointer p-2 mb-2`}
            onClick={() => handleClick(text)}
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

export default SettingsComponent;

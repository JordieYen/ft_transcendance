import React from "react";

interface IconButtonProps
  extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    React.AriaAttributes {
  children: React.ReactNode;
  className?: string;
}

export const IconButton = ({
  children,
  className,
  ...rest
}: IconButtonProps) => {
  return (
    <button className={"icon-button " + className} {...rest}>
      {children}
    </button>
  );
};

/**
 * Initial limited button component, only taking onClick and children. New
 * prototype is done to take in everything that the original button tag takes
 */
/*
interface IconButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const IconButton = ({ onClick, children }: IconButtonProps) => {
  return (
    <button className="icon-button" onClick={onClick}>
      {children}
    </button>
  );
};
*/

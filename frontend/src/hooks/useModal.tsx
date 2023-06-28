import { useState, useEffect, useRef, RefObject } from "react";

/**
 * Custom react hook:
 * 1. isOpen is a state variable defined in useState() initialized to false
 *
 * 2. setIsOpen is a setter function to change the state of isOpen
 *
 * 3. openModal and closeModal, are defined to set the isOpen state variable to
 *    true and false respectively.
 *
 * 4. (line 43) - modalRef declares a RefObject using the useRef hook. The
 *    modalRef will be used to obtain a reference to the HTML div element
 *    representing the modal component.
 *
 * 5. (line 45-63) - The useEffect hook adds or remove an event listener to the
 *    mousedown event. When the modal is open (isOpen is true), it adds an event
 *    listener that triggers the handleOutsideClick function, which checks if
 *    the mouseclick event occurred outside the modal (by comparing the event
 *    target with modalRef).
 *    If the click is outside the modal, the closeModal function is called to
 *    close the modal. Returns a cleanup function that removes the event
 *    listener when the component unmounts or when the isOpen value changes.
 *
 * 6. Function returns an array containing the isOpen state value, the openModal
 *    and closeModal functions, and the modalRef. These values can be used by
 *    the component using the useModal hook.
 */

function useModal(
  initialState = false,
): [boolean, () => void, () => void, RefObject<HTMLDivElement>] {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        event.button === 0 &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return [isOpen, openModal, closeModal, modalRef];
}

export default useModal;

import React, { useState, useEffect, RefObject } from "react";
import toast from "react-hot-toast";

interface ChangeAvatarModalProps {
  isOpen: boolean;
  closeModal: () => void;
  picRef: RefObject<HTMLDivElement>;
}

const ChangeAvatarModal = ({
  isOpen,
  closeModal,
  picRef,
}: ChangeAvatarModalProps) => {
  const [selectedPic, setSelectedPic] = useState<File | null>(null);
  const [previewPic, setPreviewPic] = useState<string | null>(null);
  const [isPicUpdated, setIsPicUpdated] = useState(false);

  const handlePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    /* The first  */
    const file = event.target.files?.[0] ?? null;
    setSelectedPic(file);
    if (file) setPreviewPic(URL.createObjectURL(file));
  };

  const handlePicUpload = () => {
    if (!selectedPic)
      toast.error("Failed to change avatar: No new image detected!");
    if (selectedPic) {
      console.log("Uploading image:", selectedPic);
      closeModal();
      toast.success("Avatar successfully updated!");
      // backend upload here
      setSelectedPic(null);
      setPreviewPic(null);
    }
  };

  useEffect(() => {
    if (isOpen === false) setSelectedPic(null);
    setIsPicUpdated(false);
    setSelectedPic(null);
    setPreviewPic(null);
  }, [isOpen]);

  return (
    <div>
      {isOpen && (
        <div className="overlay w-screen h-screen flex items-center justify-center bg-black/75 absolute top-0">
          <div
            className="overlay-content w-[400px] h-[190px] bg-onyxgrey rounded-2xl p-8"
            ref={picRef}
          >
            <h2>
              <p className="text-2xl text-dimgrey">Change avatar</p>
            </h2>
            <input type="file" accept="image/*" onChange={handlePicChange} />
            <button
              className="flex w-full rounded-md px-2 py-1 bg-jetblack justify-center"
              onClick={() => handlePicUpload()}
            >
              <p className="text-xl text-timberwolf">Update</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeAvatarModal;

import UserSettings from "../src/components/user-settings/UserSettings";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useRef } from "react";
import useModal from "@/hooks/useModal";
import ChangeAccountModal from "@/components/user-settings/ChangeAccountModal";
import ChangeAvatarModal from "@/components/user-settings/ChangeAvatarModal";
import ChangeTFAModal from "@/components/user-settings/ChangeTFAModal";
import DeleteTFAModal from "@/components/user-settings/DeleteTFAModal";
import DeleteAccountModal from "@/components/user-settings/DeleteAccountModal";
import useUserStore from "@/store/useUserStore";

export default function SettingsPage() {
  const [isAccOpen, openAccModal, closeAccModal, accRef] = useModal(false);
  const [isPicOpen, openPicModal, closePicModal, picRef] = useModal(false);
  const [isTFAOpen, openTFAModal, closeTFAModal, tfaRef] = useModal(false);
  const [isDelTFAOpen, openDelTFAModal, closeDelTFAModal, delTFARef] =
    useModal(false);
  const [isDelOpen, openDelModal, closeDelModal, delRef] = useModal(false);
  const userData = useUserStore((state) => state.userData);

  const userSettingsRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState(0);

  useEffect(() => {
    if (userSettingsRef && userSettingsRef.current) {
      const parentDiv = userSettingsRef.current;
      if (parentDiv) {
        const width = parentDiv.clientWidth;
        const height = parentDiv.clientHeight;
        console.log("height", height);
        if (height <= 900) {
          setMode(1);
        } else if (height > 900 && height <= 1080) {
          setMode(2);
        } else {
          setMode(3);
        }
      }
    }
  }, [userSettingsRef]);

  return (
    <div
      ref={userSettingsRef}
      className={`w-screen h-screen absolute top-0 left-0 ${
        (mode === 1 && "") ||
        (mode === 2 && "px-20 py-10") ||
        (mode === 3 && "px-40 py-40")
      }`}
    >
      <div className="w-full h-full pt-[128px] flex flex-col space-y-6">
        <ChangeAccountModal
          isOpen={isAccOpen}
          closeModal={closeAccModal}
          accRef={accRef}
        />
        <UserSettings
          title="Change account name"
          description="Change the name of your account."
          buttonDescArry={["update name"]}
          handleClick={[() => openAccModal()]}
          mode="button"
          icon={faUser}
        />

        <ChangeAvatarModal
          isOpen={isPicOpen}
          closeModal={closePicModal}
          picRef={picRef}
        />
        <UserSettings
          title="Change avatar"
          description="Change the avatar of your account."
          buttonDescArry={["update avatar"]}
          handleClick={[() => openPicModal()]}
          mode="button"
          icon={faImage}
        />

        {userData.authentication === false ? (
          <>
            <ChangeTFAModal
              isOpen={isTFAOpen}
              closeModal={closeTFAModal}
              tfaRef={tfaRef}
            />
            <UserSettings
              title="Enable 2FA"
              description="Enable Two-Factor-Authentication."
              buttonDescArry={["enable 2FA"]}
              handleClick={[() => openTFAModal()]}
              mode="button"
              icon={faLock}
            />
          </>
        ) : (
          <>
            <ChangeTFAModal
              isOpen={isTFAOpen}
              closeModal={closeTFAModal}
              tfaRef={tfaRef}
            />
            <DeleteTFAModal
              isOpen={isDelTFAOpen}
              closeModal={closeDelTFAModal}
              tfaRef={delTFARef}
            />
            <UserSettings
              title="Enable 2FA"
              description="Enable Two-Factor-Authentication."
              buttonDescArry={["update 2FA", "remove 2FA"]}
              handleClick={[() => openTFAModal(), () => openDelTFAModal()]}
              mode="2fadone"
              icon={faLock}
            />
          </>
        )}

        <DeleteAccountModal
          isOpen={isDelOpen}
          closeModal={closeDelModal}
          delRef={delRef}
        />
        <UserSettings
          title="Delete account"
          description="Deletes your account and all data connected to it."
          warning="You can't undo this action!"
          buttonDescArry={["delete account"]}
          handleClick={[() => openDelModal()]}
          mode="button"
          icon={faTrash}
        />
      </div>
    </div>
  );
}

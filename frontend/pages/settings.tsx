import ChangeAccountModal from "@/components/user-settings/ChangeAccountModal";
import UserSettings from "../src/components/user-settings/UserSettings";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useRef } from "react";
import useModal from "@/hooks/useModal";

export default function SettingsPage() {
  const [isAccOpen, openAccModal, closeAccModal, accRef] = useModal(false);
  const [isPicOpen, openPicModal, closePicModal, picRef] = useModal(false);
  const [isTFAOpen, openTFAModal, closeTFAModal, tfaRef] = useModal(false);
  const [isDelOpen, openDelModal, closeDelModal, delRef] = useModal(false);

  return (
    <div className="flex flex-col gap-6">
      <ChangeAccountModal
        isOpen={isAccOpen}
        closeModal={closeAccModal}
        accRef={accRef}
      />
      <UserSettings
        title="Change account name"
        description="Change the name of your account."
        buttonDescArry={["update name"]}
        handleClick={() => openAccModal()}
        mode="button"
        icon={faUser}
      />
      <UserSettings
        title="Change avatar"
        description="Change the avatar of your account."
        buttonDescArry={["update avatar"]}
        handleClick={(text) => console.log(text)}
        mode="button"
        icon={faImage}
      />
      <UserSettings
        title="Enable 2FA"
        description="Enable Two-Factor-Authentication."
        buttonDescArry={["enable 2FA"]}
        handleClick={(text) => console.log(text)}
        mode="button"
        icon={faLock}
      />
      <UserSettings
        title="Delete account"
        description="Deletes your account and all data connected to it."
        warning="You can't undo this action!"
        buttonDescArry={["delete account"]}
        handleClick={(text) => console.log(text)}
        mode="button"
        icon={faTrash}
      />
    </div>
  );
}

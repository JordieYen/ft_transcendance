import SettingsComponent from "../src/components/Settings";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SettingsComponent
        title="Change account name"
        description="Change the name of your account."
        buttonDescArry={["update name"]}
        handleClick={(text) => console.log(text)}
        mode="button"
        icon={faUser}
      />
      <SettingsComponent
        title="Change avatar"
        description="Change the avatar of your account."
        buttonDescArry={["update avatar"]}
        handleClick={(text) => console.log(text)}
        mode="button"
        icon={faImage}
      />
      <SettingsComponent
        title="Enable 2FA"
        description="Enable Two-Factor-Authentication."
        buttonDescArry={["enable 2FA"]}
        handleClick={(text) => console.log(text)}
        mode="button"
        icon={faLock}
      />
      <SettingsComponent
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

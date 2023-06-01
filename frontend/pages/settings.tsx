import UserSettings from "../src/components/UserSettings";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <UserSettings
        title="Change account name"
        description="Change the name of your account."
        buttonDescArry={["update name"]}
        handleClick={(text) => console.log(text)}
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

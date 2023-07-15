import Setup from "@/components/setup/Setup";
import ShuttlecockMove from "@/components/setup/ShuttlecockMove";

export default function SetupPage() {
  return (
    <div className="w-screen h-screen">
      <div className="flex absolute top-0 left-0">
        <ShuttlecockMove />
      </div>
      <div className="flex absolute top-0 left-0">
        <Setup />
      </div>
    </div>
  );
}

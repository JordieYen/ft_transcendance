import UserData from "@/app/webhook/UserContext";
import Avatar from "../header_icon/Avatar";

const Setup = () => {
  const userData = UserData();

  if (!userData) {
    return <div>User not found in profile...</div>;
  }

  const { avatar, username } = userData;

  return (
    <div className="w-screen h-fit bg-mydarkgrey flex flex-col items-center rounded-lg">
        <h1 className="text-2xl text-mydark">Setup Account</h1>
        <div className="form flex w-full h-full justify-stretch items-center gap-4">
            <div className="avatar flex w-1/2 justify-center items-center">
                <img  className="rounded-full" src={avatar} alt="avatar" width={200} height={200} />
            </div>
            <div className="setup w-1/2 h-full">
                <div className="flex items-center justify-center ">
                    <button className="px-4 py-2 rounded-md  bg-mydark text-mygrey">Name</button>
                </div>
                <div className="flex items-center justify-center ">
                    <button className="px-4 py-2 rounded-md  bg-mydark text-mygrey">Upload Avatar</button>
                </div>
            </div>
        </div>
        <div className="flex justify-center">
          <button className="px-4 py-2 mb-2 rounded-md bg-mydark text-mygrey">Submit</button>
        </div>
    </div>
  );
};

export default Setup;

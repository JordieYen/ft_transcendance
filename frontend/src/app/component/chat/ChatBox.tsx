import { useContext, useEffect, useRef, useState, RefObject } from "react";
import "./ChatBox.css";
import "../profile/profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import {
  faArrowLeft,
  faBars,
  faChevronDown,
  faChevronUp,
  faCrown,
  faEllipsisVertical,
  faMagnifyingGlass,
  faPen,
  faPenToSquare,
  faPlus,
  faScrewdriver,
  faTableTennisPaddleBall,
  faUserGroup,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "@/app/socket/SocketProvider";
import useUserStore from "@/store/useUserStore";
import useModal from "@/hooks/useModal";

const InviteButton = ({ currentChannel }: { currentChannel: any }) => {
  const [channelUsers, setChannelUsers] = useState<any[]>([]);
  const [gameStatus, setGameStatus] = useState<any[]>([]);
  const [FriendStatus, setFriendStatus] = useState<any>();
  let sender: any;
  let reciever: any;
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);
  const socket = useContext(SocketContext);
  // const cooldownTime = 3000; // 3 seconds
  const cooldownTime = 60000; // 60 seconds

  useEffect(() => {
    if (currentChannel?.channel_type == "direct message") {
      fetchChannelUserData();
      if (channelUsers.length != 0) {
        fetchFriendData();
      }
      if (reciever != undefined) {
        fetchGameStatus(reciever?.id);
      }
    }
  }, [currentChannel]);

  const fetchChannelUserData = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_NEST_HOST +
          "/channel-user/channel/" +
          currentChannel?.channel_uid,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const Data = await response.json();
        setChannelUsers(Data);
      }
    } catch (error) {
      // console.log("Error fetching messages data:", error);
    }
  };

  const fetchGameStatus = async (friendId: number) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_NEST_HOST + "/friend/getGameStatus/" + friendId,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const Data = await response.json();
        setGameStatus(Data);
        return gameStatus;
      }
    } catch (error) {
      // console.log("Error fetching messages data:", error);
    }
  };

  const fetchFriendData = async () => {
    try {
      if (channelUsers[0]?.user?.id == userData?.id) {
        sender = channelUsers[0]?.user;
        reciever = channelUsers[1]?.user;
      } else {
        sender = channelUsers[1]?.user;
        reciever = channelUsers[0]?.user;
      }
      const response = await fetch(
        process.env.NEXT_PUBLIC_NEST_HOST +
          "/friend/check-relationship/" +
          sender?.id +
          "/" +
          reciever?.id,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const Data = await response.json();
        setFriendStatus(Data);
      }
    } catch (error) {
      // console.log("Error fetching friend data:", error);
    }
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const SendInvite = async () => {
    if (FriendStatus?.status != "blocked") {
      if (isButtonDisabled == false) {
        socket?.emit(
          "send-message",
          "INVITATION",
          "invite",
          currentChannel?.channel_uid,
          userData.id,
        );
        if (channelUsers[0]?.user?.id == userData?.id) {
          sender = channelUsers[0]?.user;
          reciever = channelUsers[1]?.user;
        } else {
          sender = channelUsers[1]?.user;
          reciever = channelUsers[0]?.user;
        }
        // console.log("sender", sendnezer);
        // console.log("reciever", reciever);
        // const useless = await fetchGameStatus(reciever?.id);
        if (gameStatus.length == 0) {
          // console.log("ran");
          socket?.emit("invite-game", {
            user: sender,
            friend: reciever,
          });
          toast.success("Invitation Sent!");
        }
        setIsButtonDisabled(true);
        setTimeout(() => {
          setIsButtonDisabled(false);
        }, cooldownTime);
      } else {
        toast.error("invite cooldown is active");
      }
    }
  };

  return (
    <>
      <FontAwesomeIcon
        className={`invite-button ${
          currentChannel?.channel_type == "direct message"
            ? ""
            : "invite-button-invisible"
        }`}
        icon={faTableTennisPaddleBall}
        size="lg"
        style={{ color: "#1c1e20" }}
        onClick={SendInvite}
      />
    </>
  );
};

const Roles = ({
  isOpen,
  closeModal,
  modalRef,
  channelUser,
  currentChannelUser,
}: {
  isOpen: boolean;
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement>;
  channelUser: any;
  currentChannelUser: any;
}) => {
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);
  const socket = useContext(SocketContext);

  const setAdmin = async () => {
    // console.log(
    //   "user is now admin!",
    //   channelUser?.user?.id,
    //   channelUser?.channel?.channel_uid,
    // );
    socket?.emit(
      "change-role",
      "admin",
      channelUser?.user?.id,
      channelUser?.channel?.channel_uid,
      userData?.id,
    );
  };

  const setUser = async () => {
    // console.log(
    //   "user is now user!",
    //   channelUser?.user?.id,
    //   channelUser?.channel?.channel_uid,
    // );
    socket?.emit(
      "change-role",
      "user",
      channelUser?.user?.id,
      channelUser?.channel?.channel_uid,
      userData?.id,
    );
  };

  return (
    <>
      {isOpen && (
        <div className="overlay">
          <div className="mop-bg"></div>
          <div
            className={`roles-popup absolute overlay-content flex flex-col left-[97%] top-[-0%] z-[101]`}
            ref={modalRef}
          >
            <div className="r-btn-group">
              {/* <p>lol</p> */}
              <button
                className={
                  channelUser?.role == "user" ? "r-btn-selected" : "r-btn"
                }
                onClick={setUser}
              >
                User
              </button>
              <button
                className={
                  channelUser?.role == "admin" ? "r-btn-selected" : "r-btn"
                }
                onClick={setAdmin}
              >
                Administrator
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Mute = ({
  isOpen,
  closeModal,
  modalRef,
  channelUser,
  currentChannelUser,
}: {
  isOpen: boolean;
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement>;
  channelUser: any;
  currentChannelUser: any;
}) => {
  let mutedTill: string = channelUser?.mutedUntil;
  let content;
  const socket = useContext(SocketContext);
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  const muteUser = async (days: number) => {
    // console.log("user is being muted for ", days, " days");
    socket?.emit(
      "mute-user",
      channelUser?.user?.id,
      channelUser?.channel?.channel_uid,
      days,
      userData?.id,
    );
  };

  if (
    currentChannelUser?.role == "owner" ||
    currentChannelUser?.role == "admin"
  ) {
    // console.log("mutedtill", mutedTill);
    if (mutedTill == undefined) {
      mutedTill = "not muted";
      content = (
        <div>
          <p className="mute-status">Status: {mutedTill}</p>
          <button
            className="mute-buttons"
            onClick={() => {
              muteUser(1);
            }}
          >
            Mute for 1 day
          </button>
          <button
            className="mute-buttons"
            onClick={() => {
              muteUser(3);
            }}
          >
            Mute for 3 days
          </button>
          <button
            className="mute-buttons"
            onClick={() => {
              muteUser(7);
            }}
          >
            Mute for 7 days
          </button>
        </div>
      );
    } else {
      content = (
        <div>
          <p className="mute-status-user">
            Status: muted till {mutedTill.substring(0, 10)}
          </p>
          <button
            className="unmute-button"
            onClick={() => {
              muteUser(0);
            }}
          >
            Unmute
          </button>
        </div>
      );
    }
  } else if (currentChannelUser?.role == "user") {
    if (mutedTill == undefined) {
      mutedTill = "not muted";
      content = (
        <div>
          <p className="mute-status">Status: {mutedTill}</p>
        </div>
      );
    } else {
      content = (
        <div>
          <p className="mute-status-user">
            Status: muted till {mutedTill.substring(0, 10)}
          </p>
        </div>
      );
    }
  }

  mutedTill = "not muted";

  return (
    <>
      {isOpen && (
        <div className="overlay">
          <div className="mop-bg"></div>
          <div
            className={`mute-popup absolute overlay-content flex flex-col left-[97%] top-[-0%] z-[101]`}
            ref={modalRef}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
};

const ThreeDots = ({
  isOpen,
  closeModal,
  modalRef,
  user,
  channelUser,
  currentChannelUser,
}: {
  isOpen: boolean;
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement>;
  user: any;
  channelUser: any;
  currentChannelUser: any;
}) => {
  const socket = useContext(SocketContext);
  const [isRolesModalOpen, openRolesModal, closeRolesModal, modalRolesRef] =
    useModal(false);
  const [isMuteModalOpen, openMuteModal, closeMuteModal, modalMuteRef] =
    useModal(false);
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  let buttons;
  const router = useRouter();

  const handleClick = async (id: number) => {
    try {
      // console.log("id in handleClick", id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_HOST}/users/${id}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        // console.log("response in handleClick", response);
        const user = await response.json();
        router.push(`/users/${user.id}`);
      }
    } catch (error) {
      // console.log("Error redirect to profile:", error);
    }
  };

  const kickUser = async (id: number) => {
    // console.log("kicking user");
    socket?.emit("leave-channel", channelUser?.channel?.channel_uid, user.id);
    toast.success("Player has been kicked");
  };

  const banUser = async (id: number) => {
    // console.log("banning user", channelUser?.status);
    // console.log(channelUser?.user?.id, channelUser?.channel?.channel_uid);
    if (channelUser?.status == "null") {
      socket?.emit(
        "ban-from-channel",
        "banned",
        channelUser?.user?.id,
        channelUser?.channel?.channel_uid,
        userData.id,
      );
      toast.success("Player has been banned");
    } else {
      socket?.emit(
        "ban-from-channel",
        "null",
        channelUser?.user?.id,
        channelUser?.channel?.channel_uid,
        userData.id,
      );
      toast.success("Player has been unbanned");
    }
  };

  if (channelUser?.channel?.channel_type == "direct message") {
    buttons = (
      <div>
        <button
          className="member-option-button"
          onClick={() => handleClick(user?.id)}
        >
          Check
        </button>
      </div>
    );
  } else if (channelUser?.role == "user" || channelUser?.role == "admin") {
    if (
      currentChannelUser?.role == "owner" ||
      currentChannelUser?.role == "admin"
    ) {
      buttons = (
        <div>
          <button className="member-option-button" onClick={openRolesModal}>
            Role
          </button>
          <button className="member-option-button" onClick={openMuteModal}>
            Mute
          </button>
          <button
            className="member-option-button"
            onClick={() => kickUser(user?.id)}
          >
            Kick
          </button>
          <button
            className="member-option-button"
            onClick={() => banUser(user?.id)}
          >
            {channelUser?.status == "null" ? "Ban" : "Unban"}
          </button>
          <button
            className="member-option-button"
            onClick={() => handleClick(user?.id)}
          >
            Check
          </button>
        </div>
      );
    } else {
      buttons = (
        <div>
          <button className="member-option-button" onClick={openRolesModal}>
            Role
          </button>
          <button className="member-option-button" onClick={openMuteModal}>
            Mute
          </button>
          <button
            className="member-option-button"
            onClick={() => handleClick(user?.id)}
          >
            Check
          </button>
        </div>
      );
    }
  } else if (channelUser?.role == "owner") {
    buttons = (
      <div>
        <button
          className="member-option-button"
          onClick={() => handleClick(user?.id)}
        >
          Check
        </button>
      </div>
    );
  }

  return (
    <>
      {isOpen && (
        <div className="overlay">
          <div className="mop-bg"></div>
          <div
            className={`member-option-buttons absolute overlay-content flex flex-col left-[97%] top-[-0%] z-[101]`}
            ref={modalRef}
          >
            {buttons}
            {isRolesModalOpen && (
              <Roles
                isOpen={isRolesModalOpen}
                closeModal={closeRolesModal}
                modalRef={modalRolesRef}
                channelUser={channelUser}
                currentChannelUser={currentChannelUser}
              />
            )}
            {isMuteModalOpen && (
              <Mute
                isOpen={isMuteModalOpen}
                closeModal={closeMuteModal}
                modalRef={modalMuteRef}
                channelUser={channelUser}
                currentChannelUser={currentChannelUser}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

const CreateChat = ({
  isOpen,
  closeModal,
  modalRef,
}: // user,
{
  isOpen: boolean;
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement>;
  // user: any;
}) => {
  const [channelName, setChannelName] = useState("");
  const [channelPassword, setChannelPassword] = useState("");
  const [channelType, setChannelType] = useState("");
  const [isProtected, setProtected] = useState(false);

  const socket = useContext(SocketContext);

  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  const handleChannelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelName(e.target.value);
  };

  const handleChannelPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setChannelPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (channelName.trim() !== "" && channelType.trim() != "") {
      if (channelType == "protected" && channelPassword != "") {
        socket?.emit(
          "create-channel",
          channelName,
          channelType,
          channelPassword,
          userData.id,
        );
        toast.success("Channel created!");
        setChannelName("");
        setChannelType("");
        setChannelPassword("");
        await closeModal();
      } else if (channelType != "protected") {
        socket?.emit(
          "create-channel",
          channelName,
          channelType,
          channelPassword,
          userData.id,
        );
        toast.success("Channel created!");
        setChannelName("");
        setChannelType("");
        setChannelPassword("");
        await closeModal();
      } else {
        toast.error("Input a Password.");
      }
    } else {
      toast.error("Make sure everything is inputed/selected.");
    }

    if (channelPassword != "") {
      setChannelPassword("");
    }
    if (channelType != "") {
      setChannelType("");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="overlay">
          <div className="popup-bg"></div>
          <div
            className={`create-chat-popup noSelect absolute overlay-content flex flex-col z-[101]`}
            ref={modalRef}
          >
            <p className="ccp-name">Create Chat</p>
            <input
              className="ccp-input"
              type="text"
              placeholder=" Channel Name"
              value={channelName}
              onChange={handleChannelNameChange}
            />
            <div className="ccp-btn-group">
              <button
                className={
                  channelType != "public" ? "ccp-btn" : "ccp-btn-selected"
                }
                onClick={() => {
                  setChannelType("public");
                  setProtected(false);
                }}
              >
                Public
              </button>
              <button
                className={
                  channelType != "protected" ? "ccp-btn" : "ccp-btn-selected"
                }
                onClick={() => {
                  setChannelType("protected");
                  setProtected(true);
                }}
              >
                Protected
              </button>
              <button
                className={
                  channelType != "private" ? "ccp-btn" : "ccp-btn-selected"
                }
                onClick={() => {
                  setChannelType("private");
                  setProtected(false);
                }}
              >
                Private
              </button>
            </div>
            <input
              className={`ccp-input ${isProtected ? null : "invisible"}`}
              type="text"
              placeholder=" Password"
              value={channelPassword}
              onChange={handleChannelPasswordChange}
            />
            <button className="ccp-submit" onClick={handleSubmit}>
              Create
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const JoinChat = ({
  isOpen,
  closeModal,
  modalRef,
  channel,
}: // user,
{
  isOpen: boolean;
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement>;
  channel: any;
}) => {
  const [channelPassword, setChannelPassword] = useState("");

  const socket = useContext(SocketContext);

  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  const handleChannelPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setChannelPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    socket?.emit(
      "join-channel",
      channel?.channel_uid,
      channelPassword,
      userData.id,
    );
    if (channel?.channel_type != "protected") {
      toast.success("Channel Joined!");
    } else if (channelPassword == "") {
      toast.error("Input Password for Channel.");
    } else {
      toast.success("Channel Infiltration attempt made!");
    }
    if (channelPassword != "") {
      setChannelPassword("");
    }
    await closeModal();
  };

  return (
    <>
      {isOpen && (
        <div className="overlay">
          <div className="jc-popup-bg"></div>
          <div
            className={`join-chat-popup noSelect absolute overlay-content flex flex-col z-[101]`}
            ref={modalRef}
          >
            <p className="jc-name">{channel?.channel_name}</p>
            <p className="jc-desc">
              Channel Type : {channel?.channel_type}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ID: #{channel?.channel_uid}
            </p>
            <p className="jc-desc">
              Created at &nbsp;&nbsp;: {channel?.createdAt}
            </p>
            <input
              className={`jc-input ${
                channel?.channel_type == "protected" ? null : "invisible"
              }`}
              type="text"
              placeholder=" Password"
              value={channelPassword}
              onChange={handleChannelPasswordChange}
            />
            <button className="jc-submit" onClick={handleSubmit}>
              Join
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const DisplayChannel = ({ channel }: { channel: any }) => {
  const [isModalOpen, openModal, closeModal, modalRef] = useModal(false);

  return (
    <div className="friend" onClick={() => openModal()}>
      <img src="gc.jpg" className="friend-profile-pictures" />
      <div className="user-data">
        <p className="user-name">{channel?.channel_name}</p>
        <p className="user-status">
          {channel?.channel_type} #{channel?.channel_uid}
        </p>
      </div>
      {isModalOpen && (
        <JoinChat
          isOpen={isModalOpen}
          closeModal={closeModal}
          modalRef={modalRef}
          channel={channel}
        />
      )}
    </div>
  );
};

const BrowseChats = ({
  isOpen,
  closeModal,
  modalRef,
}: // user,
{
  isOpen: boolean;
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement>;
  // user: any;
}) => {
  const [refresh, setRefresh] = useState(0);
  const [channelType, setChannelType] = useState("all");
  const [channels, setChannels] = useState<any[]>([]);

  const socket = useContext(SocketContext);

  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  useEffect(() => {
    changeChannelTypeSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelType, refresh]);

  useEffect(() => {
    socket?.on("refresh-data", async function () {
      setRefresh(refresh + 1);
    });
  }, [socket, refresh]);

  useEffect(() => {
    socket?.on("search-channels-complete", async (new_channels: any) => {
      // console.log(new_channels);
      setChannels(new_channels);
    });
  }, [socket, channels]);

  const changeChannelTypeSearch = async () => {
    try {
      let response;
      if (channelType == "all") {
        response = await fetch(
          process.env.NEXT_PUBLIC_NEST_HOST + "/channel/typeall",
          {
            method: "GET",
            credentials: "include",
          },
        );
      } else {
        response = await fetch(
          process.env.NEXT_PUBLIC_NEST_HOST + "/channel/typeid/" + channelType,
          {
            method: "GET",
            credentials: "include",
          },
        );
      }
      if (response.ok) {
        const Data = await response.json();
        setChannels(Data);
      } else {
        throw new Error("Messages not found");
      }
    } catch (error) {
      // console.log("Error fetching messages data:", error);
    }
  };

  const handleChannelSearchChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      if (e.target.value == "") {
        changeChannelTypeSearch();
      } else {
        const response = await fetch(
          process.env.NEXT_PUBLIC_NEST_HOST +
            "/channel/typesearch/" +
            channelType +
            "/" +
            e.target.value,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (response.ok) {
          const Data = await response.json();
          setChannels(Data);
        } else {
          throw new Error("Messages not found");
        }
      }
    } catch (error) {
      // console.log("Error fetching messages data:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="overlay">
          <div className="popup-bg"></div>
          <div
            className={`browse-chat-popup noSelect absolute overlay-content flex flex-col z-[101]`}
            ref={modalRef}
          >
            <p className="ccp-name">Explore Chats</p>
            <input
              className="ccp-input"
              type="text"
              placeholder=" Search Channel"
              onChange={handleChannelSearchChange}
            />
            <div className="ccp-btn-group">
              <button
                className={
                  channelType != "all" ? "ccp-btn" : "ccp-btn-selected"
                }
                onClick={async () => {
                  await setChannelType("all");
                }}
              >
                All
              </button>
              <button
                className={
                  channelType != "public" ? "ccp-btn" : "ccp-btn-selected"
                }
                onClick={async () => {
                  await setChannelType("public");
                }}
              >
                Public
              </button>
              <button
                className={
                  channelType != "protected" ? "ccp-btn" : "ccp-btn-selected"
                }
                onClick={async () => {
                  await setChannelType("protected");
                }}
              >
                Protected
              </button>
            </div>
            <div className="bcp-channels">
              {channels.map((channel, index) => (
                <DisplayChannel channel={channel} key={index} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DisplayUser = ({
  channelUser,
  currentChannelUser,
}: {
  channel: any;
  channelUser: any;
  currentChannelUser: any;
}) => {
  const [isModalOpen, openModal, closeModal, modalRef] = useModal(false);

  if (channelUser?.channel?.channel_type == "direct message") {
    return (
      <div className="members relative">
        <p className="members-name">{channelUser?.user?.username}</p>
        <FontAwesomeIcon
          className="dots-button"
          icon={faEllipsisVertical}
          size="lg"
          style={{ color: "#d1d0c5" }}
          onClick={() => openModal()}
        />
        {isModalOpen && (
          <ThreeDots
            isOpen={isModalOpen}
            closeModal={closeModal}
            modalRef={modalRef}
            user={channelUser.user}
            channelUser={channelUser}
            currentChannelUser={currentChannelUser}
          />
        )}
      </div>
    );
  } else if (channelUser?.role == "owner") {
    return (
      <div className="members relative">
        <p className="members-name">{channelUser?.user?.username}</p>
        <FontAwesomeIcon
          className="dots-button"
          icon={faCrown}
          size="lg"
          style={{ color: "#d1d0c5" }}
          onClick={() => openModal()}
        />
        {isModalOpen && (
          <ThreeDots
            isOpen={isModalOpen}
            closeModal={closeModal}
            modalRef={modalRef}
            user={channelUser.user}
            channelUser={channelUser}
            currentChannelUser={currentChannelUser}
          />
        )}
      </div>
    );
  } else if (channelUser?.status == "banned") {
    return (
      <div className="members relative">
        <p className="members-name">{channelUser?.user?.username}</p>
        <FontAwesomeIcon
          className="dots-button"
          icon={faXmark}
          size="lg"
          style={{ color: "#d1d0c5" }}
          onClick={() => openModal()}
        />
        {isModalOpen && (
          <ThreeDots
            isOpen={isModalOpen}
            closeModal={closeModal}
            modalRef={modalRef}
            user={channelUser.user}
            channelUser={channelUser}
            currentChannelUser={currentChannelUser}
          />
        )}
      </div>
    );
  }

  return (
    <div className="members relative">
      <p className="members-name">{channelUser?.user?.username}</p>
      <FontAwesomeIcon
        className="dots-button"
        icon={channelUser?.role == "user" ? faEllipsisVertical : faScrewdriver}
        size="lg"
        style={{ color: "#d1d0c5" }}
        onClick={() => openModal()}
      />
      {isModalOpen && (
        <ThreeDots
          isOpen={isModalOpen}
          closeModal={closeModal}
          modalRef={modalRef}
          user={channelUser.user}
          channelUser={channelUser}
          currentChannelUser={currentChannelUser}
        />
      )}
    </div>
  );
};

const DisplayMessage = ({
  message,
  messages,
  index,
}: {
  message: any;
  messages: any;
  index: number;
}) => {
  const [FriendStatus, setFriendStatus] = useState<any>();
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);
  // console.log(message?.sender?.id);

  useEffect(() => {
    if (userData != undefined && message?.sender != undefined) {
      fetchFriendData();
    }
  }, [message]);

  const fetchFriendData = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_NEST_HOST +
          "/friend/check-relationship/" +
          userData.id +
          "/" +
          message?.sender?.id,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const Data = await response.json();
        setFriendStatus(Data);
      }
    } catch (error) {
      // console.log("Error fetching friend data:", error);
    }
  };

  if (FriendStatus?.status == "blocked") {
    return;
  }

  if (message?.message_type == "invite") {
    return (
      <div>
        <li className="list-item" key={index}>
          <p
            className={`sender-name ${
              messages[index - 1]?.sender?.username !==
              message?.sender?.username
                ? null
                : "invisible"
            }`}
          >
            {message?.sender?.username}
          </p>
          <p className="sender-message invite-color"> Sent an Invite! </p>
        </li>
        {/* <li>
          <div className="invite">
            <p>{message?.sender?.username} sent an Invite!</p>
            <div className="invite-request">
              <button className="ir-button">accept</button>
              <button className="ir-button">decline</button>
            </div>
          </div>
        </li> */}
      </div>
    );
  }

  return (
    <li className="list-item" key={index}>
      <p
        className={`sender-name ${
          messages[index - 1]?.sender?.username !== message?.sender?.username
            ? null
            : "invisible"
        }`}
      >
        {message?.sender?.username}
      </p>
      <p className="sender-message">{message?.message_content}</p>
    </li>
  );
};

const DisplayChannelName = ({ channel }: { channel: any }) => {
  const [channelUsers, setChannelUsers] = useState<any[]>([]);
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  useEffect(() => {
    if (channel?.channel_type == "direct message") {
      fetchChannelUserData();
    }
  }, [channel]);

  const fetchChannelUserData = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_NEST_HOST +
          "/channel-user/channel/" +
          channel?.channel_uid,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const Data = await response.json();
        setChannelUsers(Data);
      }
    } catch (error) {
      // console.log("Error fetching messages data:", error);
    }
  };

  if (channel?.channel_type == "direct message") {
    // console.log("in");
    // console.log(channelUsers);
    // console.log(channelUsers[0]?.user?.avatar);
    let avatar;
    let username;
    let userStatus;
    if (userData.id == channelUsers[0]?.user?.id) {
      avatar = channelUsers[1]?.user?.avatar;
      username = channelUsers[1]?.user?.username;
      if ((channelUsers[1]?.user?.online)) {
        userStatus = "offline";
      } else {
        userStatus = "online";
      }
    } else {
      avatar = channelUsers[0]?.user?.avatar;
      username = channelUsers[0]?.user?.username;
      if ((channelUsers[0]?.user?.online)) {
        userStatus = "offline";
      } else {
        userStatus = "online";
      }
    }

    return (
      <div>
        {/* <img src={avatar} className="friend-profile-pictures" /> */}
        <h1 className="chat-name">{username}</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="chat-name">
        {channel?.channel_name}
        {/* {channelId != "-1" ? "" : "Why did u do that?"} */}
      </h1>
    </div>
  );
};

const DisplayGroupChannel = ({ channel }: { channel: any }) => {
  const [channelUsers, setChannelUsers] = useState<any[]>([]);
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  useEffect(() => {
    if (channel?.channel_type == "direct message") {
      fetchChannelUserData();
    }
  }, [channel]);

  const fetchChannelUserData = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_NEST_HOST +
          "/channel-user/channel/" +
          channel?.channel_uid,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const Data = await response.json();
        setChannelUsers(Data);
      }
    } catch (error) {
      // console.log("Error fetching messages data:", error);
    }
  };

  if (channel?.channel_type == "direct message") {
    // console.log("in");
    // console.log(channelUsers);
    // console.log(channelUsers[0]?.user?.avatar);
    let avatar;
    let username;
    let userStatus;
    if (userData.id == channelUsers[0]?.user?.id) {
      avatar = channelUsers[1]?.user?.avatar;
      username = channelUsers[1]?.user?.username;
      if ((userStatus = channelUsers[1]?.user?.online)) {
        userStatus = "online";
      } else {
        userStatus = "offline";
      }
    } else {
      avatar = channelUsers[0]?.user?.avatar;
      username = channelUsers[0]?.user?.username;
      if ((userStatus = channelUsers[0]?.user?.online)) {
        userStatus = "online";
      } else {
        userStatus = "offline";
      }
    }

    return (
      <div className="friend">
        <img src={avatar} className="friend-profile-pictures" />
        <div className="user-data">
          <p className="user-name">{username}</p>
          {/* <p className="user-status">{channel?.channel_type}</p> */}
          <p className="user-status">{userStatus}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="friend">
      <img src="gc.jpg" className="friend-profile-pictures" />
      <div className="user-data">
        <p className="user-name">{channel?.channel_name}</p>
        <p className="user-status">{channel?.channel_type}</p>
      </div>
    </div>
  );
};

const ChangeChannelPassword = ({
  isOpen,
  closeModal,
  modalRef,
  channel,
  channelUser,
}: {
  isOpen: boolean;
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement>;
  channel: any;
  channelUser: any;
}) => {
  const [oldChannelPassword, setOldChannelPassword] = useState("");
  const [newChannelPassword, setNewChannelPassword] = useState("");
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  const socket = useContext(SocketContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(oldChannelPassword, newChannelPassword);
    socket?.emit(
      "change-password",
      channel?.channel_uid,
      oldChannelPassword,
      newChannelPassword,
      userData?.id,
    );
    setOldChannelPassword("");
    setNewChannelPassword("");
    closeModal();
  };

  const handleOldChannelPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setOldChannelPassword(e.target.value);
  };

  const handleNewChannelPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewChannelPassword(e.target.value);
  };

  return (
    <>
      {isOpen && (
        <div className="overlay">
          <div className="cct-bg"></div>
          <div
            className={`change-channel-password-popup noSelect absolute overlay-content flex flex-col z-[101]`}
            ref={modalRef}
          >
            <input
              className={`ccpp-input`}
              type="text"
              placeholder="Old Password"
              value={oldChannelPassword}
              onChange={handleOldChannelPasswordChange}
            />
            <input
              className={`ccpp-input`}
              type="text"
              placeholder="New Password"
              value={newChannelPassword}
              onChange={handleNewChannelPasswordChange}
            />
            <button className="ccpp-submit" onClick={handleSubmit}>
              Change
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const ChangeChannelType = ({
  isOpen,
  closeModal,
  modalRef,
  channel,
  channelUser,
}: {
  isOpen: boolean;
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement>;
  channel: any;
  channelUser: any;
}) => {
  const [newChannelPassword, setNewChannelPassword] = useState("");
  const [channelType, setChannelType] = useState("");
  const [isProtected, setProtected] = useState(false);

  const socket = useContext(SocketContext);
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  let displayPublic = "";
  let displayProtected = "";
  let displayPrivate = "";

  if (channel?.channel_type == "public") {
    displayPublic = "none";
  } else if (channel?.channel_type == "protected") {
    displayProtected = "none";
  } else if (channel?.channel_type == "private") {
    displayPrivate = "none";
  }

  const handleNewChannelPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewChannelPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("changing channel type", channelType, newChannelPassword);
    if (channelType != "") {
      if (channelType != "protected" || newChannelPassword != "") {
        // console.log("change!");
        socket?.emit(
          "change-channel-type",
          channel?.channel_uid,
          channelType,
          newChannelPassword,
          userData?.id,
        );
        toast.success("Channel Type changed!");
      }
    }
    setNewChannelPassword("");
    closeModal();
  };

  return (
    <>
      {isOpen && (
        <div className="overlay">
          <div className="cct-bg"></div>
          <div
            className={`change-channel-type-popup noSelect absolute overlay-content flex flex-col z-[101]`}
            ref={modalRef}
          >
            <p className="cct-name">New Channel Type</p>
            <div className="cct-btn-group">
              <button
                className={`${displayPublic} ${
                  channelType != "public" ? "ccp-btn" : "ccp-btn-selected"
                }`}
                onClick={() => {
                  setChannelType("public");
                  setProtected(false);
                }}
              >
                Public
              </button>
              <button
                className={`${displayProtected} ${
                  channelType != "protected" ? "ccp-btn" : "ccp-btn-selected"
                }`}
                onClick={() => {
                  setChannelType("protected");
                  setProtected(true);
                }}
              >
                Protected
              </button>
              <button
                className={`${displayPrivate} ${
                  channelType != "private" ? "ccp-btn" : "ccp-btn-selected"
                }`}
                onClick={() => {
                  setChannelType("private");
                  setProtected(false);
                }}
              >
                Private
              </button>
            </div>
            <input
              className={`cct-input ${
                channelType == "protected" ? null : "invisible"
              }`}
              type="text"
              placeholder=" Password"
              value={newChannelPassword}
              onChange={handleNewChannelPasswordChange}
            />
            <button className="cct-submit" onClick={handleSubmit}>
              Change
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const MembersMore = ({
  isOpen,
  closeModal,
  modalRef,
  channel,
  channelUser,
}: {
  isOpen: boolean;
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement>;
  channel: any;
  channelUser: any;
}) => {
  const [
    isChangeChannelTypeModalOpen,
    openChangeChannelTypeModal,
    closeChangeChannelTypeModal,
    modalChangeChannelTypeRef,
  ] = useModal(false);
  const [
    isChangeChannelPasswordModalOpen,
    openChangeChannelPasswordModal,
    closeChangeChannelPasswordModal,
    modalChangeChannelPasswordRef,
  ] = useModal(false);

  const socket = useContext(SocketContext);

  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  let buttons;

  const handleLeave = async () => {
    // console.log("I left");
    socket?.emit("leave-channel", channel?.channel_uid, userData.id);
    toast.success("You have left the channel.");
  };

  if (
    channelUser?.role == "owner" &&
    channelUser?.channel?.channel_type != "direct message"
  ) {
    buttons = (
      <div className="filler">
        <button
          className={`mm-change-channel-password ${
            channel?.channel_type == "protected" ? null : "invisible"
          }`}
          onClick={openChangeChannelPasswordModal}
        >
          Change Channel Password
        </button>
        {isChangeChannelPasswordModalOpen && (
          <ChangeChannelPassword
            isOpen={isChangeChannelPasswordModalOpen}
            closeModal={closeChangeChannelPasswordModal}
            modalRef={modalChangeChannelPasswordRef}
            channel={channel}
            channelUser={channelUser}
          />
        )}
        <button
          className="mm-change-channel-type"
          onClick={openChangeChannelTypeModal}
        >
          Change Channel Type
        </button>
        {isChangeChannelTypeModalOpen && (
          <ChangeChannelType
            isOpen={isChangeChannelTypeModalOpen}
            closeModal={closeChangeChannelTypeModal}
            modalRef={modalChangeChannelTypeRef}
            channel={channel}
            channelUser={channelUser}
          />
        )}
        <button className="mm-leave-channel" onClick={handleLeave}>
          Leave Channel
        </button>
      </div>
    );
  } else {
    buttons = (
      <div className="filler">
        <button className="mm-leave-channel" onClick={handleLeave}>
          Leave Channel
        </button>
      </div>
    );
  }

  if (channelUser?.channel?.channel_type == "direct message") {
    buttons = "";
  }

  return (
    <>
      {isOpen && (
        <div className="overlay">
          <div className="mm-popup-bg"></div>
          <div
            className={`members-more-popup noSelect absolute overlay-content flex flex-col z-[101]`}
            ref={modalRef}
          >
            <p className="jc-name">{channel?.channel_name}</p>
            <p className="jc-desc">
              Channel Type : {channel?.channel_type}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ID: #{channel?.channel_uid}
            </p>
            <p className="mm-desc">
              Created at &nbsp;&nbsp;: {channel?.createdAt}
            </p>
            {buttons}
          </div>
        </div>
      )}
    </>
  );
};

import { useRouter } from "next/router";
import MatchMakingButton from "../game/MatchMakingButton";
import ChooseGameMode from "../game/ChooseGameMode";
import { useGameData } from "../game/GameContext";
import toast from "react-hot-toast";

const ChatBox: React.FC<any> = () => {
  const [refresh, setRefresh] = useState(0);
  const [chat_slide_out, setChatSlideOut] = useState(false);
  const [group_slide_out, setGroupSlideOut] = useState(false);
  const [chat_members_slide_out, setChatMembersSlideOut] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [allUsers, setUsers] = useState<any[]>([]);
  const [searchUsers, setSearchUsers] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [channelUsers, setChannelUsers] = useState<any[]>([]);
  const [channelId, setChannelId] = useState("-1");
  const [currentChannel, setCurrentChannel] = useState<any>(null);
  const [currentChannelUser, setCurrentChannelUser] = useState<any>(null);
  const [
    isCreateChatModalOpen,
    openCreateChatModal,
    closeCreateChatModal,
    modalCreateChatRef,
  ] = useModal(false);
  const [
    isBrowseChatModalOpen,
    openBrowseChatModal,
    closeBrowseChatModal,
    modalBrowseChatRef,
  ] = useModal(false);
  const [
    isMembersMoreModalOpen,
    openMembersMoreModal,
    closeMembersMoreModal,
    modalMembersMoreRef,
  ] = useModal(false);
  const socket = useContext(SocketContext);

  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**** game part begin *******/
  const [selectedGameMode, setSelectedGameMode] = useState<string>("classic");

  const handleSelectGameMode = (gameMode: any) => {
    setSelectedGameMode(gameMode);
  };

  const [isMatchmaking, setIsMatchmaking] = useState(false);

  const handleMatchmaking = () => {
    setIsMatchmaking(!isMatchmaking);
  };

  /**** game part end *******/

  useEffect(() => {
    fetchMessageData();
    fetchUserData();
    if (userData.id != undefined || channelId != "-1") {
      fetchChannelData();
      fetchCurrentChannelUserData();
    }
    fetchChannelUserData();
    fetchCurrentChannelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, channelId, refresh]);

  const gameState = useGameData().gameState;
  useEffect(() => {
    socket?.emit("clear-room", {
      roomId: gameState?.roomId,
      user: userData,
    });
  }, [channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket?.on("refresh-data", async function () {
      setRefresh(refresh + 1);
    });
  }, [socket, refresh]);

  useEffect(() => {
    socket?.on(
      "message-recieved",
      async function (new_message: any, channel_id: string) {
        const idNumber = new_message?.channel?.channel_uid;
        const idString: string = "" + idNumber;
        const channelIdString: string = "" + channelId;
        if (idString == channelId) {
          setMessages([...messages, new_message]);
        }
      },
    );
  }, [socket, messages]);

  useEffect(() => {
    socket?.on("channel-created", async function (new_channel: any) {
      setChannels([...channels, new_channel]);
    });
  }, [socket, channels]);

  useEffect(() => {
    socket?.on("search-channels-complete-group", async (new_channels: any) => {
      setChannels(new_channels);
    });
  }, [socket, channels]);

  const fetchMessageData = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_NEST_HOST + "/message/id/" + channelId,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const messageData = await response.json();
        setMessages(messageData);
      } else {
        throw new Error("Messages not found");
      }
    } catch (error) {
      // console.log("Error fetching messages data:", error);
    }
  };
  if (!messages) {
    return <div>messages not found</div>;
  }

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        // `${process.env.NEXT_PUBLIC_NEST_HOST}/users`,
        process.env.NEXT_PUBLIC_NEST_HOST + "/users",
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
        // console.log("userContent", userData);
        setChats(userData);
      } else {
        throw new Error("Users not found");
      }
    } catch (error) {
      // console.log("Error fetching user data:", error);
    }
  };
  if (!messages) {
    return <div>users not found</div>;
  }

  const fetchChatData = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_NEST_HOST + "/chat",
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const messageData = await response.json();
        const messageContent = messageData.map((message: any) => {
          return message.message_content;
        });
        setMessages(messageContent);
        // console.log("messageContent", messageContent);
      } else {
        throw new Error("Messages not found");
      }
    } catch (error) {
      // console.log("Error fetching messages data:", error);
    }
  };
  if (!messages) {
    return <div>messages not found</div>;
  }

  const fetchChannelData = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_NEST_HOST + "/channel/userid/" + userData.id,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const channelData = await response.json();
        setChannels(channelData);
        // console.log("channelContent", channelData);
      } else {
        throw new Error("Messages not found");
      }
    } catch (error) {
      // console.log("Error fetching messages data:", error);
    }
  };
  if (!messages) {
    return <div>messages not found</div>;
  }

  const fetchChannelUserData = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_NEST_HOST +
          "/channel-user/channel/" +
          channelId,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const channelUserData = await response.json();
        setChannelUsers(channelUserData);
        // console.log("channelUserContent", channelUserData);
      } else {
        throw new Error("Messages not found");
      }
    } catch (error) {
      // console.log("Error fetching messages data:", error);
    }
  };
  if (!messages) {
    return <div>messages not found</div>;
  }

  const fetchCurrentChannelData = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_NEST_HOST + "/channel/id/" + channelId,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const channelData = await response.json();
        setCurrentChannel(channelData);
        // console.log("channelUserContent", channelData);
      } else {
        throw new Error("Messages not found");
      }
    } catch (error) {
      // console.log("Error fetching messages data:", error);
    }
  };
  if (!messages) {
    return <div>messages not found</div>;
  }

  const fetchCurrentChannelUserData = async () => {
    try {
      const request = `${process.env.NEXT_PUBLIC_NEST_HOST}channel-user/channeluser/${channelId}/${userData.id}`;
      // console.log("bruh", request);
      const response = await fetch(
        process.env.NEXT_PUBLIC_NEST_HOST +
          "/channel-user/channeluser/" +
          channelId +
          "/" +
          userData.id,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const channelData = await response.json();
        setCurrentChannelUser(channelData);
      } else {
        throw new Error("Messages not found");
      }
    } catch (error) {
      // console.log("Error fetching messages data:", error);
    }
  };
  if (!messages) {
    return <div>messages not found</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      const mutedTill: string = currentChannelUser?.mutedUntil;
      if (currentChannelUser?.status != "banned" && mutedTill == undefined) {
        socket?.emit(
          "send-message",
          inputValue,
          "text",
          channelId,
          userData.id,
        );
      } else {
        // console.log("error : unable to send message");
      }
      setInputValue("");
    }
  };

  const SendInvite = async () => {
    socket?.emit(
      "send-message",
      "INVITATION",
      "invite",
      channelId,
      userData.id,
    );
  };

  const handleChannelSearchChanges = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // console.log(e.target.value);
    // socket?.emit("search-channel-with-name-group", e.target.value, userData.id);
    try {
      if (e.target.value == "") {
        fetchChannelData();
      } else {
        const response = await fetch(
          process.env.NEXT_PUBLIC_NEST_HOST +
            "/channel/searchgroup/" +
            e.target.value,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (response.ok) {
          const Data = await response.json();
          setChannels(Data);
        } else {
          throw new Error("Messages not found");
        }
      }
    } catch (error) {
      // console.log("Error fetching messages data:", error);
    }
  };

  const pressMe = async () => {
    toast.success(
      "CREDITS\n\nChat by JORDAN HII\nGame by JOEL HII\nBackend by STEH\nDesign by ZER\n\n Hope you like our first ever fullstack project!",
    );
  };

  return (
    <div className="main-menu">
      <div className="background"></div>
      <div
        className={`chat-background ${chat_slide_out ? "darken" : "normal"}`}
        onClick={() => {
          chat_slide_out ? setChatSlideOut((current) => !current) : null;
        }}
      ></div>
      <div className="chat">
        <div className="slide-container">
          <FontAwesomeIcon
            className={`slide-button ${chat_slide_out ? "hide" : "display"}`}
            icon={faComments}
            style={{ color: "#d1d0c5" }}
            onClick={async () => {
              await setGroupSlideOut(true);
              setChatSlideOut((current) => !current);
            }}
          />
        </div>
        {/* <div
          className={`chat-style side-bar ${
            chat_slide_out ? "display" : "hide"
          }`}
        >
          <FontAwesomeIcon
            className="group-button"
            icon={faUserGroup}
            size="lg"
            style={{ color: "#d1d0c5" }}
            onClick={() => setGroupSlideOut((current) => !current)}
          />
          <div>
            {allUsers.map((user, index) => (
              <img
                src={user?.avatar}
                key={index}
                className="profile-pictures"
              />
            ))}
          </div>
        </div> */}
        <div
          className={`chat-box chat-style ${
            chat_slide_out ? "display" : "hide"
          }`}
        >
          <div
            className={`group-box ${
              group_slide_out ? "group-box-display" : "group-box-hide"
            }`}
          >
            <div className="group-title">
              <FontAwesomeIcon
                className="back-group"
                icon={faArrowLeft}
                size="lg"
                style={{ color: "#d1d0c5" }}
                onClick={() => setGroupSlideOut((current) => !current)}
              />
              <p className="title">Chats</p>
            </div>
            <form>
              <input
                className="search-bar"
                type="text"
                placeholder=" Find Chat . . ."
                onChange={handleChannelSearchChanges}
              />
            </form>
            <div className="friends">
              {channels.map((channel, index) => (
                <div
                  // className="friend"
                  key={index}
                  onClick={() => {
                    setChannelId(channel?.channel_uid);
                    setGroupSlideOut((current) => !current);
                  }}
                >
                  {/* <img src="gc.jpg" className="friend-profile-pictures" />
                  <div className="user-data">
                    <p className="user-name">{channel?.channel_name}</p>
                    <p className="user-status">{channel?.channel_type}</p>
                  </div> */}
                  <DisplayGroupChannel channel={channel} />
                </div>
              ))}
              {/* {allUsers.map((user, index) => (
                <div
                  key={index}
                  className={`friend ${user?.online ? null : "offline"}`}
                >
                  <img src={user?.avatar} className="friend-profile-pictures" />
                  <div className="user-data">
                    <p className="user-name">{user?.username}</p>
                    <p className="user-status">
                      {user?.online ? "online" : "offline"}
                    </p>
                  </div>
                </div>
              ))} */}
              <FontAwesomeIcon
                className="search-group"
                icon={faMagnifyingGlass}
                size="lg"
                style={{ color: "#d1d0c5" }}
                onClick={() => openBrowseChatModal()}
              />
              <FontAwesomeIcon
                className="plus-group"
                icon={faPenToSquare}
                size="lg"
                style={{ color: "#d1d0c5" }}
                onClick={() => openCreateChatModal()}
              />
              {isBrowseChatModalOpen && (
                <BrowseChats
                  isOpen={isBrowseChatModalOpen}
                  closeModal={closeBrowseChatModal}
                  modalRef={modalBrowseChatRef}
                  // user={channelUser.user}
                />
              )}
              {isCreateChatModalOpen && (
                <CreateChat
                  isOpen={isCreateChatModalOpen}
                  closeModal={closeCreateChatModal}
                  modalRef={modalCreateChatRef}
                  // user={channelUser.user}
                />
              )}
            </div>
          </div>
          <div className="chat-nav">
            <div className="chat-title">
              <FontAwesomeIcon
                className={`more-chats-button ${
                  channelId != "-1" ? "" : "increase-size"
                }`}
                icon={faBars}
                size="lg"
                style={{ color: "#d1d0c5" }}
                onClick={() => setGroupSlideOut((current) => !current)}
              />
            </div>
            <DisplayChannelName channel={currentChannel} />
            <FontAwesomeIcon
              className={`more-button ${channelId != "-1" ? "" : "invisible"}`}
              icon={chat_members_slide_out ? faChevronUp : faChevronDown}
              size="lg"
              style={{ color: "#d1d0c5" }}
              onClick={() => setChatMembersSlideOut((current) => !current)}
            />
          </div>
          <div className={`lost ${channelId == "-1" ? "" : "invisible"}`}>
            <div className="meme">
              <img src="pika.png" className="pika" />
              <p>what are you looking for?</p>
            </div>
            <button className="members-more credits" onClick={pressMe}>
              Press me
            </button>
          </div>
          <div className={`npa-logo ${channelId != "-1" ? "" : "invisible"}`}>
            <img src="shuut.png" className="npa" />
          </div>
          <div
            className={`chat-members ${
              chat_members_slide_out
                ? "chat-members-display"
                : "chat-members-hide"
            }`}
          >
            {channelUsers.map((channelUser, index) => (
              <DisplayUser
                channel={currentChannel}
                channelUser={channelUser}
                currentChannelUser={currentChannelUser}
                key={index}
              />
            ))}
            <div className="members" onClick={() => openMembersMoreModal()}>
              <button className="members-more">More</button>
            </div>
            {isMembersMoreModalOpen && (
              <MembersMore
                isOpen={isMembersMoreModalOpen}
                closeModal={closeMembersMoreModal}
                modalRef={modalMembersMoreRef}
                channel={currentChannel}
                channelUser={currentChannelUser}
              />
            )}
          </div>
          <ul className="list">
            {messages.map((message, index) => (
              <DisplayMessage
                message={message}
                messages={messages}
                index={index}
                key={index}
              />
            ))}
            <li ref={messagesEndRef}></li>
          </ul>
          <div
            className={`message-div ${channelId != "-1" ? "" : "invisible"}`}
          >
            <form className="message-bar chat-style" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder=" message . . ."
                value={inputValue}
                onChange={handleInputChange}
              />
            </form>
            <InviteButton currentChannel={currentChannel} />
          </div>
        </div>
      </div>
      <div className="bottom-nav">
        {/* <button
          className="bottom-nav-buttons"
          onClick={() => setChatSlideOut((current) => !current)}
        >
          Friends
        </button> */}
        {/* <button className="bottom-nav-buttons">Friends</button> */}
        {/* <button
          className="bottom-nav-buttons"
          onClick={() => router.push("game-loading")}
        >
          Find match
        </button> */}
        {/* <MatchMakingButton/> */}
        <ChooseGameMode
          onSelectGameMode={handleSelectGameMode}
          isMatchmaking={isMatchmaking}
        />
        <MatchMakingButton
          gameMode={selectedGameMode}
          onMatchMaking={handleMatchmaking}
        />
      </div>
    </div>
  );
};

export default ChatBox;

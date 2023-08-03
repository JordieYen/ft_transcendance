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
  faTableTennisPaddleBall,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "@/app/socket/SocketProvider";
import useUserStore from "@/store/useUserStore";
import useModal from "@/hooks/useModal";

const Roles = ({
  isOpen,
  closeModal,
  modalRef,
  channelUser,
}: {
  isOpen: boolean;
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement>;
  channelUser: any;
}) => {
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
                // onClick={() => {
                //   setChannelType("public");
                //   setProtected(false);
                // }}
              >
                User
              </button>
              <button
                className={
                  channelUser?.role == "admin" ? "r-btn-selected" : "r-btn"
                }
                // onClick={() => {
                //   setChannelType("protected");
                //   setProtected(true);
                // }}
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

  if (
    currentChannelUser?.role == "owner" ||
    currentChannelUser?.role == "administrator"
  ) {
    if (mutedTill == undefined) {
      mutedTill = "not muted";
      content = (
        <div>
          <p className="mute-status">Status: {mutedTill}</p>
          <button className="mute-buttons">Mute for 1 day</button>
          <button className="mute-buttons">Mute for 3 days</button>
          <button className="mute-buttons">Mute for 7 days</button>
        </div>
      );
    } else {
      content = (
        <div>
          <p className="mute-status-user">
            Status: muted till {mutedTill.substring(0, 10)}
          </p>
          <button className="unmute-button">Unmute</button>
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
  const [isRolesModalOpen, openRolesModal, closeRolesModal, modalRolesRef] =
    useModal(false);
  const [isMuteModalOpen, openMuteModal, closeMuteModal, modalMuteRef] =
    useModal(false);

  let buttons;

  if (channelUser?.role == "user") {
    buttons = (
      <div>
        <button className="member-option-button" onClick={openRolesModal}>
          Role
        </button>
        <button className="member-option-button" onClick={openMuteModal}>
          Mute
        </button>
        <button className="member-option-button">Check</button>
        <button className="member-option-button">More...</button>
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
      }
      if (channelType != "protected") {
        socket?.emit(
          "create-channel",
          channelName,
          channelType,
          channelPassword,
          userData.id,
        );
      }
      setChannelName("");
      setChannelType("");
      setChannelPassword("");
    }

    if (channelPassword != "") {
      setChannelPassword("");
    } else {
      console.log("channel-password is empty");
    }
    if (channelType != "") {
      setChannelType("");
    } else {
      console.log("channel-type not selected");
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
    if (channelPassword != "") {
      setChannelPassword("");
    }
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
  }, [channelType]);

  useEffect(() => {
    socket?.on("search-channels-complete", async (new_channels: any) => {
      // console.log(new_channels);
      setChannels(new_channels);
    });
  }, [socket, channels]);

  const changeChannelTypeSearch = () => {
    socket?.emit("search-channel-type", channelType, userData.id);
  };

  const handleChannelSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // console.log(e.target.value);
    socket?.emit(
      "search-channel-with-name",
      channelType,
      e.target.value,
      userData.id,
    );
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
  channelUser: any;
  currentChannelUser: any;
}) => {
  const [isModalOpen, openModal, closeModal, modalRef] = useModal(false);

  if (channelUser?.role == "owner") {
    return (
      <div className="members relative">
        <p className="members-name">{channelUser?.user?.username}</p>
        <FontAwesomeIcon
          className="dots-button"
          icon={faCrown}
          size="lg"
          style={{ color: "#d1d0c5" }}
        />
        {/* <FontAwesomeIcon
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
          />
        )} */}
      </div>
    );
  }

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
  if (message?.message_type == "invite") {
    return (
      <li>
        <div className="invite">
          <p>{message?.sender?.username} sent an Invite!</p>
          <div className="invite-request">
            <button className="ir-button">accept</button>
            <button className="ir-button">decline</button>
          </div>
        </div>
      </li>
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
              // value={channelPassword}
              // onChange={handleChannelPasswordChange}
            />
            <input
              className={`ccpp-input`}
              type="text"
              placeholder="New Password"
              // value={channelPassword}
              // onChange={handleChannelPasswordChange}
            />
            <button className="ccpp-submit">Change</button>
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
  const [channelType, setChannelType] = useState("");
  const [isProtected, setProtected] = useState(false);
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
              // value={channelPassword}
              // onChange={handleChannelPasswordChange}
            />
            <button className="cct-submit">Change</button>
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

  let buttons;

  if (channelUser?.role == "owner") {
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
      </div>
    );
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
            <button className="mm-leave-channel">Leave Channel</button>
          </div>
        </div>
      )}
    </>
  );
};
import { useRouter } from "next/router";

const ChatBox: React.FC<any> = () => {
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
  const [channelId, setChannelId] = useState("2");
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
  const router = useRouter();

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

  useEffect(() => {
    fetchMessageData();
    fetchUserData();
    fetchChatData();
    fetchChannelData();
    fetchChannelUserData();
    fetchCurrentChannelData();
    fetchCurrentChannelUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket?.on(
      "message-recieved",
      async function (new_message: any, channel_id: string) {
        // console.log("new", new_message);
        // console.log("message", messages[1]);
        // console.log("broooo", new_message?.channelChannelUid);
        const idNumber = new_message?.channel?.channel_uid;
        const idString: string = "" + idNumber;
        const channelIdString: string = "" + channelId;
        console.log(
          "lollll",
          new_message?.channel?.channel_uid,
          idNumber,
          idString,
          channelId,
          channelIdString,
        );
        if (idString == channelId) {
          console.log("ran");
          setMessages([...messages, new_message]);
        }
      },
    );
  }, [socket, messages]);

  useEffect(() => {
    socket?.on("channel-created", async function (new_channel: any) {
      // console.log("test", new_channel?.channel_uid);
      setChannels([...channels, new_channel]);
    });
  }, [socket, channels]);

  useEffect(() => {
    socket?.on("search-channels-complete-group", async (new_channels: any) => {
      // console.log(new_channels);
      setChannels(new_channels);
    });
  }, [socket, channels]);

  const fetchMessageData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/message/id/" + channelId,
        {
          method: "GET",
          credentials: "include",
        },
      );
      // const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_HOST}/message`, {
      //   method: "GET",
      //   credentials: "include",
      // });
      if (response.ok) {
        const messageData = await response.json();
        setMessages(messageData);
        // console.log("message", messages);
      } else {
        throw new Error("Messages not found");
      }
    } catch (error) {
      console.log("Error fetching messages data:", error);
    }
  };
  if (!messages) {
    return <div>messages not found</div>;
  }

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        // `${process.env.NEXT_PUBLIC_NEST_HOST}/users`,
        "http://localhost:3000/users",
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
      console.log("Error fetching user data:", error);
    }
  };
  if (!messages) {
    return <div>users not found</div>;
  }

  const fetchChatData = async () => {
    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "GET",
        credentials: "include",
      });
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
      console.log("Error fetching messages data:", error);
    }
  };
  if (!messages) {
    return <div>messages not found</div>;
  }

  const fetchChannelData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/channel/userid/" + userData.id,
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
      console.log("Error fetching messages data:", error);
    }
  };
  if (!messages) {
    return <div>messages not found</div>;
  }

  const fetchChannelUserData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/channel-user/channel/" + channelId,
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
      console.log("Error fetching messages data:", error);
    }
  };
  if (!messages) {
    return <div>messages not found</div>;
  }

  const fetchCurrentChannelData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/channel/id/" + channelId,
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
      console.log("Error fetching messages data:", error);
    }
  };
  if (!messages) {
    return <div>messages not found</div>;
  }

  const fetchCurrentChannelUserData = async () => {
    try {
      const request = `${process.env.NEXT_PUBLIC_NEST_HOST}channel-user/channeluser/${channelId}/${userData.id}`;
      console.log("bruh", request);
      const response = await fetch(
        "http://localhost:3000/channel-user/channeluser/" +
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
      console.log("Error fetching messages data:", error);
    }
  };
  if (!messages) {
    return <div>messages not found</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      socket?.emit("send-message", inputValue, "text", channelId, userData.id);
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
    // socket?.emit("search-channel-with-name-group");
    socket?.emit("search-channel-with-name-group", e.target.value, userData.id);
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
            onClick={() => setChatSlideOut((current) => !current)}
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
                  className="friend"
                  key={index}
                  onClick={() => {
                    setChannelId(channel?.channel_uid);
                    setGroupSlideOut((current) => !current);
                  }}
                >
                  <img src="gc.jpg" className="friend-profile-pictures" />
                  <div className="user-data">
                    <p className="user-name">{channel?.channel_name}</p>
                    <p className="user-status">{channel?.channel_type}</p>
                    {/* #{channel?.channel_uid}</p> */}
                  </div>
                </div>
              ))}
              {allUsers.map((user, index) => (
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
              ))}
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
                className="more-chats-button"
                icon={faBars}
                size="lg"
                style={{ color: "#d1d0c5" }}
                onClick={() => setGroupSlideOut((current) => !current)}
              />
            </div>
            <h1 className="chat-name">{currentChannel?.channel_name}</h1>
            <FontAwesomeIcon
              className="more-button"
              icon={chat_members_slide_out ? faChevronUp : faChevronDown}
              size="lg"
              style={{ color: "#d1d0c5" }}
              onClick={() => setChatMembersSlideOut((current) => !current)}
            />
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
          <div className="message-div">
            <form className="message-bar chat-style" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder=" message . . ."
                value={inputValue}
                onChange={handleInputChange}
              />
            </form>
            <FontAwesomeIcon
              className="invite-button"
              icon={faTableTennisPaddleBall}
              size="lg"
              style={{ color: "#1c1e20" }}
              onClick={SendInvite}
            />
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
        <button className="bottom-nav-buttons">Friends</button>
        <button
          className="bottom-nav-buttons"
          onClick={() => router.push("game-loading")}
        >
          Find match
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

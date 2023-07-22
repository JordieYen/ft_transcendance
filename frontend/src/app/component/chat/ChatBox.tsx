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
import useUserStore from "@/hooks/useUserStore";
import useModal from "@/hooks/useModal";

const ThreeDots = ({
  isOpen,
  closeModal,
  modalRef,
  user,
}: {
  isOpen: boolean;
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement>;
  user: any;
}) => {
  return (
    <>
      {isOpen && (
        <div className="overlay">
          <div
            className={`member-option-buttons absolute overlay-content flex flex-col left-[97%] top-[-0%] z-[101]`}
            ref={modalRef}
          >
            <button className="member-option-button">Role</button>
            <button className="member-option-button">Mute</button>
            <button className="member-option-button">Check</button>
            <button className="member-option-button">More...</button>
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
      console.log(new_channels);
      setChannels(new_channels);
    });
  }, [socket, channels]);

  const changeChannelTypeSearch = () => {
    socket?.emit("search-channel-type", channelType, userData.id);
  };

  const handleChannelSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    socket?.emit("search-channel-with-name", channelType, e.target.value, userData.id);
  };

  return (
    <>
      {isOpen && (
        <div className="overlay">
          <div className="popup-bg"></div>
          <div
            className={`browse-chat-popup absolute overlay-content flex flex-col z-[101]`}
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
                <div
                  className="friend"
                  key={index}
                  onClick={() => {
                    // setChannelId(channel?.channel_uid);
                    // setGroupSlideOut((current) => !current);
                  }}
                >
                  <img src="gc.jpg" className="friend-profile-pictures" />
                  <div className="user-data">
                    <p className="user-name">{channel?.channel_name}</p>
                    <p className="user-status">{channel?.channel_type} #{channel?.channel_uid}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DisplayUser = ({ channelUser }: { channelUser: any }) => {
  const [isModalOpen, openModal, closeModal, modalRef] = useModal(false);

  return (
    <div className="members relative">
      <p>{channelUser?.user?.username}</p>
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
        />
      )}
      {/* <div className="member-options">
                  <div className="member-buttons">
                    <button>role</button>
                    <button>mute</button>
                    <button>test</button>
                  </div>
                </div> */}
    </div>
  );
};

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
  const [channelId, setChannelId] = useState("1");
  const [currentChannel, setCurrentChannel] = useState<any>(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket?.on("message-recieved", async function (new_message: any) {
      console.log("new", new_message);
      console.log("message", messages[1]);
      setMessages([...messages, new_message]);
    });
  }, [socket, messages]);

  useEffect(() => {
    socket?.on("channel-created", async function (new_channel: any) {
      console.log("new-channel", new_channel);
      console.log("channel", channels[1]);
      setChannels([...channels, new_channel]);
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
      if (response.ok) {
        const messageData = await response.json();
        setMessages(messageData);
        console.log("message", messages);
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
      const response = await fetch("http://localhost:3000/users", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
        console.log("userContent", userData);
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
        console.log("messageContent", messageContent);
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
        console.log("channelContent", channelData);
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
        console.log("channelUserContent", channelUserData);
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
        console.log("channelUserContent", channelData);
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
                placeholder=" Find Someone . . ."
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
              <DisplayUser channelUser={channelUser} key={index} />
            ))}
          </div>
          <ul className="list">
            <li>
              <div className="invite">
                <p>User sent an Invite!</p>
                <div className="invite-request">
                  <button>accept</button>
                  <button>decline</button>
                </div>
              </div>
            </li>
            {messages.map((message, index) => (
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
                <p className="sender-message">{message?.message_content}</p>
              </li>
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
        <button className="bottom-nav-buttons">Find match</button>
      </div>
    </div>
  );
};

export default ChatBox;

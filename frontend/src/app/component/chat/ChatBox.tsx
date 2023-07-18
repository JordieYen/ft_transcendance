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
        <div className=" overlay">
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
  const [channelId, setChannelId] = useState("84");
  const [currentChannel, setCurrentChannel] = useState<any>(null);

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
                    <p className="user-status">#{channel?.channel_uid}</p>
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
              <h1 className="chat-name">{currentChannel?.channel_name}</h1>
            </div>
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

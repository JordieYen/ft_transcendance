import { useContext, useEffect, useRef, useState } from "react";
import "./ChatBox.css";
import "../profile/profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import {
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

  const socket = useContext(SocketContext);

  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  let users: String[];

  // users = ["jking-ye", "steh", "jhii", "naz", "leulee", "jakoh", "bro", "atsuki", "gojo", "hyun-zhe", "kwang", "wding-ha", "fr", "bruh"];
  users = ["jking-ye", "steh", "jhii", "naz", "leulee", "jakoh", "bro"];

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
  }, []);

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
      const response = await fetch("http://localhost:3000/message/id/84", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const messageData = await response.json();
        // const messageContent = messageData.map((message: any) => {
        //   return message.message_content;
        // });
        // setMessages(messageContent);
        // console.log("messageContent", messageContent);
        setMessages(messageData);
        console.log("meesage", messages);
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
        // const userContent = userData.map((user: any) => {
        //   return user.avatar;
        // });
        // setUsers(userContent);
        // console.log("userContent", userContent);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      // const response = await fetch("http://localhost:3000/message/create", {
      //   method: "POST",
      //   credentials: "include",
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     message_content: inputValue,
      //     message_type: "text",
      //     channel_id: 84
      //   })
      // });
      socket?.emit("send-message", inputValue, "text", 84, userData.id);
      // console.log("text", inputValue);
      // setMessages([...messages, inputValue]);

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
        <div
          className={`chat-style side-bar ${
            chat_slide_out ? "display" : "hide"
          }`}
        >
          {/* <img
            className="back-button"
            src="arrow-left.png"
            onClick={() => setChatSlideOut((current) => !current)}
            alt="back-button"
          /> */}
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
        </div>
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
            <p className="title">People</p>
            <form>
              <input
                className="search-bar"
                type="text"
                placeholder=" Find Someone . . ."
              />
            </form>
            <div className="friends">
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
            <h1 className="chat-name">jking-ye</h1>
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
            {users.map((user, index) => (
              <div className="members" key={index}>
                <p>{user}</p>
                <FontAwesomeIcon
                  className="dots-button"
                  icon={faEllipsisVertical}
                  size="lg"
                  style={{ color: "#d1d0c5" }}
                  onClick={() => setChatSlideOut((current) => !current)}
                />
              </div>
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
                <p className="sender-name">{message?.sender?.username}</p>
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

import { useContext, useEffect, useRef, useState } from "react";
import "./ChatBox.css";
import "../profile/profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import {
  faChevronDown,
  faChevronUp,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "@/app/socket/SocketProvider";

const ChatBox: React.FC<any> = () => {
  const [chat_slide_out, setChatSlideOut] = useState(false);
  const [chat_members_slide_out, setChatMembersSlideOut] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [allUsers, setUsers] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const socket = useContext(SocketContext);
  const messagesEndRef = useRef(null);

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
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessageData = async () => {
    try {
      const response = await fetch("http://localhost:3000/message", {
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

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const userData = await response.json();
        const userContent = userData.map((user: any) => {
          return user.avatar;
        });
        setUsers(userContent);
        console.log("userContent", userContent);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      socket?.emit("message", inputValue);
      console.log("text", inputValue);
      setMessages([...messages, inputValue]);
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
          <img
            className="back-button"
            src="arrow-left.png"
            onClick={() => setChatSlideOut((current) => !current)}
            alt="back-button"
          />
          <div>
            {allUsers.map((user, index) => (
              <img src={user} key={index} className="profile-pictures"/>
            ))}
          </div>
        </div>
        <div
          className={`chat-style chat-box ${
            chat_slide_out ? "display" : "hide"
          }`}
        >
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
            {messages.map((message, index) => (
              <li className="list-item" key={index}>
                {message}
              </li>
            ))}
            <li ref={messagesEndRef}></li>
          </ul>
          <form className="message-bar chat-style" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder=" message . . ."
              value={inputValue}
              onChange={handleInputChange}
            />
          </form>
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

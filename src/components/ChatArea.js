import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BiSend, BiPaperclip } from "react-icons/bi";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth"; // Import signOut from Firebase auth
import logoKSD from "./logoKSD.png";
import { db } from "../Firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

//current

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #000000;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative; /* Added to position the sign-out button */
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative; /* Ensure the sign-out button aligns properly */
`;

const SignInButton = styled.div`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(50%);
  background: #444;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background: #555;
  }
`;

const SignOutButton = styled.div`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: #d60303b5;
  color: white;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(239, 68, 68, 0.5);
  transition: all 0.3s ease-in-out;
  z-index: 10;

  &:hover {
    background: #dc2626;
    box-shadow: 0px 6px 12px rgba(220, 38, 38, 0.7);
  }

  &:focus {
    outline: none;
    box-shadow: 0px 0px 10px rgba(239, 68, 68, 0.8);
  }

  @media (max-width: 500px) {
    top: 20px;
    transition: all 0.3s ease-in-out;
  }
`;

const HeaderInfo = styled.div`
  h1 {
    font-size: 20px;
    margin: 0;
  }
  p {
    margin: 0;
    color: #888;
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Message = styled.div`
  display: flex;
  gap: 12px;
  max-width: 80%;
  ${(props) => props.isUser && "margin-left: auto;"}
`;

const MessageContent = styled.div`
  background: ${(props) => (props.isUser ? "#0084ff" : "#222")};
  padding: 12px 16px;
  border-radius: 12px;
  color: #ffffff;
`;

const InputArea = styled.div`
  padding: 20px;
  background: #111;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  background: #222;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;

  &:focus {
    outline: none;
    background: #333;
  }

  &::placeholder {
    color: #666;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

const Logo = styled.img`
  height: 40px;
  width: auto;
  margin-left: auto;

  @media (max-width: 500px) {
    height: 35px;
    width: auto;
    margin-left: 50px;
  }
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Popup = styled.div`
  background: #1e1e1e;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  width: 90%;
  max-width: 400px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
`;

const PopupTitle = styled.h2`
  color: #ffffff;
  margin-bottom: 16px;
`;

const PopupText = styled.p`
  color: #aaaaaa;
  font-size: 14px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.2s;
`;

const GoogleButton = styled(Button)`
  background: #4285f4;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #357ae8;
  }
`;

const GuestButton = styled(Button)`
  background: #444;
  color: #ffffff;

  &:hover {
    background: #666;
  }
`;

const ChatArea = ({ activeChat, user, setUser, handleSignOut }) => {
  const [newMessage, setNewMessage] = useState("");
  const [showSignOut, setShowSignOut] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false); // State to toggle sign-in button initially
  const [showSignInOptions, setShowSignInOptions] = useState(false); // Show sign-in options for guest users
  const [messages, setMessages] = useState([]);

  // Fetch messages from Firestore whenever the activeChat or user changes
  useEffect(() => {
    if (activeChat && user) {
      const messagesRef = collection(
        db,
        "users",
        user.uid,
        "chats",
        activeChat.id.toString(),
        "messages"
      );
      const messagesQuery = query(messagesRef, orderBy("timestamp"));

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        console.log("Messages fetched:", snapshot.docs);
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages); // Set the messages to state
      });

      // Cleanup on unmount or when the activeChat changes
      return () => unsubscribe();
    }
  }, [activeChat, user]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        text: newMessage,
        isUser: true,
      };

      const botMessage = {
        id: Date.now() + 1,
        text: "hi",
        isUser: false,
      };

      // Add messages to UI state
      activeChat.messages.push(userMessage);
      activeChat.messages.push(botMessage);
      // Add messages to UI state (for immediate display)
      setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
      setNewMessage("");
      setNewMessage("");

      // Store messages in Firestore if user is signed in
      if (user) {
        try {
          const chatRef = collection(
            db,
            "users",
            user.uid,
            "chats",
            activeChat.id.toString(),
            "messages"
          );
          await addDoc(chatRef, {
            text: newMessage,
            isUser: true,
            timestamp: serverTimestamp(),
          });

          await addDoc(chatRef, {
            text: "hi",
            isUser: false,
            timestamp: serverTimestamp(),
          });
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    }
  };

  const handleAvatarClick = () => {
    if (user) {
      setShowSignOut((prevState) => !prevState); // Toggle sign-out button visibility
    } else {
      setShowSignInOptions(true); // Show sign-in options if the user is a guest
    }
  };

  const handleSignOutConfirmation = () => {
    const confirmation = window.confirm("Are you sure you want to sign out?");
    if (confirmation) {
      handleSignOut(); // Proceed with sign out
      setShowSignOut(false); // Hide sign-out button
    }
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Update user info with Google data

      setUser(result.user);
      setShowSignInOptions(false); // Close popup after Google sign-in

      console.log(
        "Google successfull photourl inside chatarea:",
        result.user.photoURL
      );
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleGuestLogin = async () => {
    setUser(null); // Keep as guest
    setShowSignInOptions(false); // Close popup after choosing guest login
  };

  return (
    <ChatContainer>
      <Header>
        {/* Display profile picture if user is logged in, else show 'G' for guest */}
        <Avatar onClick={handleAvatarClick}>
          {user ? (
            <img
              src={user.photoURL}
              alt="Profile"
              style={{ width: "100%", borderRadius: "50%" }}
              crossOrigin="anonymous"
            />
          ) : (
            "G"
          )}
        </Avatar>
        {console.log("img src:", user?.photoURL)}

        {/* Show Sign-In button if the user is a guest */}
        {showSignInOptions && !user && (
          <Overlay>
            <Popup>
              <PopupTitle>Sign In</PopupTitle>
              <PopupText>Choose your sign-in method:</PopupText>
              <GoogleButton onClick={handleGoogleSignIn}>
                <svg
                  style={{
                    width: "16px",
                    height: "16px",
                    marginRight: "8px",
                  }}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 19"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                    clipRule="evenodd"
                  />
                </svg>
                Sign in with Google
              </GoogleButton>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <hr
                  style={{
                    height: "0",
                    borderBottom: "1px solid #6B7280",
                    flexGrow: 1,
                  }}
                />
                <p style={{ margin: "0 15px", color: "#6B7280" }}>or</p>
                <hr
                  style={{
                    height: "0",
                    borderBottom: "1px solid #6B7280",
                    flexGrow: 1,
                  }}
                />
              </div>

              <GuestButton onClick={handleGuestLogin}>
                Continue as Guest
              </GuestButton>
            </Popup>
          </Overlay>
        )}

        {/* Show the sign-out button if avatar is clicked and the user is signed in */}
        {showSignOut && user && (
          <SignOutButton onClick={handleSignOutConfirmation}>
            Sign Out
          </SignOutButton>
        )}

        <HeaderInfo>
          <h1>{activeChat.title}</h1>
          <p>{messages.length} messages</p>
        </HeaderInfo>

        <Logo src={logoKSD} alt="Logo" />
      </Header>

      <MessagesArea>
        {(messages || []).map((message) => (
          <Message key={message.id} isUser={message.isUser}>
            {!message.isUser && <Avatar>G</Avatar>}
            <MessageContent isUser={message.isUser}>
              {message.text}
            </MessageContent>
          </Message>
        ))}
      </MessagesArea>

      <InputArea>
        <IconButton>
          <BiPaperclip />
        </IconButton>
        <Input
          type="text"
          placeholder="Type a new message here"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <IconButton onClick={handleSend}>
          <BiSend />
        </IconButton>
      </InputArea>
    </ChatContainer>
  );
};

export default ChatArea;

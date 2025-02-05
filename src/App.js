import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { auth, googleProvider, signInWithPopup, signInAnonymously, signOut } from './Firebase';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #000000;
  color: #ffffff;
  overflow: hidden;
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
  background: #4285F4;
  color: #ffffff;

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

function App() {
  const [conversations, setConversations] = useState([
    { id: 1, title: 'First Conversation', messages: [{ id: 1, text: 'Hello!', isUser: false }] }
  ]);
  const [activeChat, setActiveChat] = useState(conversations[0]);
  const [showPopup, setShowPopup] = useState(true); // Controls popup visibility
  const [user, setUser] = useState(null); // Store logged-in user
  const [showSignOut, setShowSignOut] = useState(false); // Controls showing sign out option

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setShowPopup(false); // Close popup after login
      console.log("Sign in with Google successful");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  // Handle Guest Login
  const handleGuestLogin = async () => {
    try {
      const result = await signInAnonymously(auth);
      setUser(null);
      setShowPopup(false); // Close popup after login
    } catch (error) {
      console.error("Guest Login Error:", error);
    }
  };

  // Handle Sign-Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setShowSignOut(false); // Hide sign out option after sign out
      console.log("Sign out succesful");
    } catch (error) {
      console.error("Sign Out Error:", error);
    }
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `New Chat ${conversations.length + 1}`,
      messages: []
    };
    setConversations([newChat, ...conversations]);
    setActiveChat(newChat);
  };

  const handleChangeActiveChat = (chat) => {
    setActiveChat(chat);
  };

  const handleEditTitle = (id, newTitle) => {
    const updatedConversations = conversations.map((chat) =>
      chat.id === id ? { ...chat, title: newTitle } : chat
    );
    setConversations(updatedConversations);
    if (activeChat.id === id) {
      setActiveChat({ ...activeChat, title: newTitle });
    }
  };

  return (
    <>
      {showPopup && (
        <Overlay>
          <Popup>
            <PopupTitle>Disclaimer</PopupTitle>
            <PopupText>
              This product belongs to KSDAdvisory, and the models used might produce inaccurate information.
            </PopupText>
            <GoogleButton onClick={handleGoogleSignIn}>Sign in with Google</GoogleButton>
            <GuestButton onClick={handleGuestLogin}>Sign in as Guest for now</GuestButton>
          </Popup>
        </Overlay>
      )}

      <AppContainer>
        <Sidebar
          conversations={conversations}
          handleNewChat={handleNewChat}
          handleChangeActiveChat={handleChangeActiveChat}
          handleEditTitle={handleEditTitle}
        />
        <ChatArea activeChat={activeChat} user={user} setUser={setUser} handleSignOut={handleSignOut} showSignOut={showSignOut} setShowSignOut={setShowSignOut}  />
      </AppContainer>
    </>
  );
}

export default App;

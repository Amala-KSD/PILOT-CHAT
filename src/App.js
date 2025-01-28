import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #000000;
  color: #ffffff;
  overflow: hidden;
`;

function App() {
  const [conversations, setConversations] = useState([
    { id: 1, title: 'First Conversation', messages: [{ id: 1, text: 'Hello!', isUser: false }] }
  ]);
  const [activeChat, setActiveChat] = useState(conversations[0]);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `New Chat ${conversations.length + 1}`,
      messages: []
    };
    setConversations([newChat, ...conversations]);
    setActiveChat(newChat); // Set new chat as active
  };

  const handleChangeActiveChat = (chat) => {
    setActiveChat(chat);
  };

  const handleEditTitle = (id, newTitle) => {
    const updatedConversations = conversations.map((chat) =>
      chat.id === id ? { ...chat, title: newTitle } : chat
    );
    setConversations(updatedConversations); // Update the title in the state
    if (activeChat.id === id) {
      setActiveChat({ ...activeChat, title: newTitle }); // Also update the active chat's title
    }
  };

  return (
    <AppContainer>
      <Sidebar
        conversations={conversations}
        handleNewChat={handleNewChat}
        handleChangeActiveChat={handleChangeActiveChat}
        handleEditTitle={handleEditTitle} // Pass the edit title handler
      />
      <ChatArea activeChat={activeChat} />
    </AppContainer>
  );
}

export default App;

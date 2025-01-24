import React, { useState } from 'react';
import styled from 'styled-components';
import { BiMessageSquareAdd } from 'react-icons/bi';

const SidebarContainer = styled.div`
  width: 80px;
  height: 100vh;
  background: #000000;
  padding: 16px;
  border-right: 1px solid #333;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    width: 280px;
  }
`;

const NewChatButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  ${SidebarContainer}:hover & {
    justify-content: flex-start;
  }

  span {
    display: none;
    ${SidebarContainer}:hover & {
      display: block;
    }
  }

  &:hover {
    background: #f0f0f0;
  }
`;

const ConversationList = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Conversation = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ConversationTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  color: #ffffff;
  display: none;
  
  ${SidebarContainer}:hover & {
    display: block;
  }
`;

const MessageCount = styled.span`
  font-size: 14px;
  color: #888;
  display: none;
  
  ${SidebarContainer}:hover & {
    display: block;
  }
`;

const Sidebar = () => {
  const [conversations, setConversations] = useState([
    { id: 1, title: 'First Conversation', messages: 1 }
  ]);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `New Chat ${conversations.length + 1}`,
      messages: 0
    };
    setConversations([newChat, ...conversations]);
  };

  return (
    <SidebarContainer>
      <NewChatButton onClick={handleNewChat}>
        <BiMessageSquareAdd size={20} />
        <span>New Chat</span>
      </NewChatButton>

      <ConversationList>
        {conversations.map(chat => (
          <Conversation key={chat.id}>
            <ConversationTitle>
              {chat.title}
            </ConversationTitle>
            <MessageCount>
              {chat.messages} messages
            </MessageCount>
          </Conversation>
        ))}
      </ConversationList>
    </SidebarContainer>
  );
};

export default Sidebar;
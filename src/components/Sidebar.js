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
  display: ${(props) => (props.isEditing ? 'none' : 'block')};
`;

const TitleInput = styled.input`
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  background: transparent;
  border: none;
  width: 100%;
  outline: none;
  padding: 0;
`;

const Sidebar = ({ conversations, handleNewChat, handleChangeActiveChat, handleEditTitle }) => {
  const [editingTitleId, setEditingTitleId] = useState(null); // Track the chat that's being edited
  const [newTitle, setNewTitle] = useState('');

  const handleTitleClick = (chat) => {
    setEditingTitleId(chat.id); // Set the chat being edited
    setNewTitle(chat.title); // Set the title to the current title of the chat
  };

  const handleBlur = (chat) => {
    if (newTitle.trim()) {
      handleEditTitle(chat.id, newTitle); // Update the title of the chat
    }
    setEditingTitleId(null); // Exit editing mode
  };

  return (
    <SidebarContainer>
      <NewChatButton onClick={handleNewChat}>
        <BiMessageSquareAdd size={20} />
        <span>New Chat</span>
      </NewChatButton>

      <ConversationList>
        {conversations.map((chat) => (
          <Conversation key={chat.id} onClick={() => handleChangeActiveChat(chat)}>
            {editingTitleId === chat.id ? (
              <TitleInput
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)} // Update title as user types
                onBlur={() => handleBlur(chat)} // Save title when input loses focus
                onKeyPress={(e) => e.key === 'Enter' && handleBlur(chat)} // Save title on pressing Enter
                autoFocus
              />
            ) : (
              <ConversationTitle onClick={() => handleTitleClick(chat)}>{chat.title}</ConversationTitle>
            )}
          </Conversation>
        ))}
      </ConversationList>
    </SidebarContainer>
  );
};

export default Sidebar;

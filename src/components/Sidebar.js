import React, { useState } from "react";
import styled from "styled-components";
import { BiMessageSquareAdd } from "react-icons/bi";
import DropDownModel from "./CustomDropdown";

const SidebarContainer = styled.div`
  width: ${(props) => (props.isExpanded ? "280px" : "80px")};
  height: 100vh;
  background: #000000;
  padding: 16px;
  border-right: 1px solid #333;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;

  @media (max-width: 500px) {
    overflow: visible;
    padding-left: 8px;
    padding-right: 8px;
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

  span {
    display: ${(props) => (props.isExpanded ? "block" : "none")};
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
  display: ${(props) => (props.isExpanded ? "block" : "none")};
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

const HintText = styled.p`
  font-size: 12px;
  color: #888;
  margin: 0;
  display: ${(props) => (props.isExpanded ? "block" : "none")};
`;
const ConversationTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ModelSelect = styled.select`
  width: 100%;
  padding: 12px;
  background: #000; /* Black background */
  color: #fff; /* White text */
  border: 1px solid #333; /* Slight border */
  border-radius: 8px;
  font-size: 16px;
  margin-top: 12px;
  cursor: pointer;
  display: ${(props) => (props.isExpanded ? "block" : "none")};

  &:focus {
    outline: none;
    border-color: #666;
  }

  }
`;

const Sidebar = ({
  conversations,
  handleNewChat,
  handleChangeActiveChat,
  handleEditTitle,
}) => {
  const [selectedModel, setSelectedModel] = useState("Gemini 1.5 Pro");
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const handleTitleClick = (chat) => {
    setEditingTitleId(chat.id);
    setNewTitle(chat.title);
  };

  const handleBlur = (chat) => {
    if (newTitle.trim()) {
      handleEditTitle(chat.id, newTitle);
    }
    setEditingTitleId(null);
  };

  return (
    <SidebarContainer
      isExpanded={isExpanded}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <NewChatButton isExpanded={isExpanded} onClick={handleNewChat}>
        <BiMessageSquareAdd size={20} />
        <span>New Chat</span>
      </NewChatButton>

      {/* <ModelSelect
        value={selectedModel}
        isExpanded={isExpanded}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
        <option value="GPT 4.0">GPT 4.0</option>
      </ModelSelect> */}

      <DropDownModel isExpanded={isExpanded} />

      <ConversationList>
        {conversations.map((chat) => (
          <Conversation
            key={chat.id}
            onClick={() => handleChangeActiveChat(chat)}
          >
            {editingTitleId === chat.id ? (
              <TitleInput
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={() => handleBlur(chat)}
                onKeyPress={(e) => e.key === "Enter" && handleBlur(chat)}
                autoFocus
              />
            ) : (
              <ConversationTitleContainer>
                <ConversationTitle
                  isExpanded={isExpanded}
                  onClick={() => handleTitleClick(chat)}
                >
                  {chat.title}
                </ConversationTitle>
                <HintText isExpanded={isExpanded}>
                  Tap title to edit it
                </HintText>
              </ConversationTitleContainer>
            )}
          </Conversation>
        ))}
      </ConversationList>
    </SidebarContainer>
  );
};

export default Sidebar;

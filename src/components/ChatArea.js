import React, { useState } from 'react';
import styled from 'styled-components';
import { BiSend, BiPaperclip } from 'react-icons/bi';


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
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
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
  ${props => props.isUser && 'margin-left: auto;'}
`;

const MessageContent = styled.div`
  background: ${props => props.isUser ? '#0084ff' : '#222'};
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

const ChatArea = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "This AI chatbot has been developed to optimize communication and simplify work processes, ultimately leading to smoother operations.",
      isUser: false
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: Date.now(), text: newMessage, isUser: true }]);
      setNewMessage('');
    }
  };

  return (
    <ChatContainer>
      <Header>
        <Avatar>AI</Avatar>
        <HeaderInfo>
          <h1>Welcome back,</h1>
          <p>Suvigya</p>
        </HeaderInfo>
      </Header>
      <MessagesArea>
        {messages.map(message => (
          <Message key={message.id} isUser={message.isUser}>
            {!message.isUser && <Avatar>AI</Avatar>}
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
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <IconButton onClick={handleSend}>
          <BiSend />
        </IconButton>
      </InputArea>
    </ChatContainer>
  );
};

export default ChatArea;
import React, { useState } from 'react';
import styled from 'styled-components';
import { BiSend, BiPaperclip } from 'react-icons/bi';
import { signOut } from 'firebase/auth'; // Import signOut from Firebase auth
import logoKSD from './logoKSD.png';

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

const Logo = styled.img`
  height: 40px;
  width: auto;
  margin-left: auto;
`;

const ChatArea = ({ activeChat, user, handleSignOut, handleSignIn }) => {
  const [newMessage, setNewMessage] = useState('');
  const [showSignOut, setShowSignOut] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false); // State to toggle sign-in button

  const handleSend = () => {
    if (newMessage.trim()) {
      // Add user's message
      activeChat.messages.push({ id: Date.now(), text: newMessage, isUser: true });

      // Add bot's response immediately after user's message
      activeChat.messages.push({ id: Date.now() + 1, text: 'hi', isUser: false });

      // Reset the input field
      setNewMessage('');
    }
  };

  const handleAvatarClick = () => {
    if (user) {
      setShowSignOut(prevState => !prevState); // Toggle sign-out button visibility
    } else {
      setShowSignIn(true); // Show sign-in button if no user
    }
  };

  return (
    <ChatContainer>
      <Header>
        {/* Display profile picture if user is logged in, else show 'G' for guest */}
        <Avatar onClick={handleAvatarClick}>
          {user ? (
            <img src={user.photoURL} alt="Profile" style={{ width: '100%', borderRadius: '50%' }} />
          ) : (
            'G'
          )}
        </Avatar>

        {/* Show Sign-In button if the user is a guest */}
        {showSignIn && !user && (
          <SignInButton onClick={handleSignIn}>
            Sign In
          </SignInButton>
        )}

        {/* Show the sign-out button if avatar is clicked and the user is signed in */}
        {showSignOut && user && (
          <SignOutButton onClick={() => {
            handleSignOut(); 
            setShowSignOut(false); // Hide sign-out button
          }}>
            Sign Out
          </SignOutButton>
        )}

        <HeaderInfo>
          <h1>{activeChat.title}</h1>
          <p>{activeChat.messages.length} messages</p>
        </HeaderInfo>

        <Logo src={logoKSD} alt="Logo" />
      </Header>

      <MessagesArea>
        {activeChat.messages.map(message => (
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

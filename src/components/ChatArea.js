import React, { useState } from 'react';
import styled from 'styled-components';
import { BiSend, BiPaperclip } from 'react-icons/bi';
import { getAuth, GoogleAuthProvider, signInWithPopup ,signOut } from 'firebase/auth'; // Import signOut from Firebase auth
import logoKSD from './logoKSD.png';

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


const ChatArea = ({ activeChat, user, setUser, handleSignOut }) => {
  const [newMessage, setNewMessage] = useState('');
  const [showSignOut, setShowSignOut] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false); // State to toggle sign-in button initially
  const [showSignInOptions, setShowSignInOptions] = useState(false); // Show sign-in options for guest users

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
            <img src={user.photoURL} alt="Profile" style={{ width: '100%', borderRadius: '50%' }} />
          ) : (
            'G'
          )}
        </Avatar>

        {/* Show Sign-In button if the user is a guest */}
        {showSignInOptions && !user && (
          <Overlay>
          <Popup>
            <PopupTitle>Sign In</PopupTitle>
            <PopupText>Choose your sign-in method:</PopupText>
            <GoogleButton onClick={handleGoogleSignIn}>Sign in with Google</GoogleButton>
            <GuestButton onClick={handleGuestLogin}>Continue as Guest</GuestButton>
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

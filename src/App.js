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
  return (
    <AppContainer>
      <Sidebar />
      <ChatArea />
    </AppContainer>
  );
}

export default App;
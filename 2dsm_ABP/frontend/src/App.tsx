import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import ChatScreen from './components/ChatScreen';
import Login from './pages/Login';
import Admin from './pages/Admin';
import type { UserType } from './types/chat';

function ChatApp() {
  const [screen, setScreen] = useState<'welcome' | 'chat'>('welcome');
  const [userType, setUserType] = useState<UserType>('externo');

  const handleSelect = (type: string) => {
    setUserType(type as UserType);
    setScreen('chat');
  };

  return screen === 'welcome'
    ? <WelcomeScreen onSelect={handleSelect} />
    : <ChatScreen userType={userType} onBack={() => setScreen('welcome')} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
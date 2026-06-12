import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import ChatScreen from './components/ChatScreen';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import type { UserType } from './types/chat';

function PublicArea() {
  const [screen, setScreen] = useState<'welcome' | 'chat'>('welcome');
  const [userType, setUserType] = useState<UserType>('externo');

  const handleSelect = (type: string): void => {
    setUserType(type as UserType);
    setScreen('chat');
  };

  return screen === 'welcome'
    ? <WelcomeScreen onSelect={handleSelect} />
    : <ChatScreen userType={userType} onBack={() => setScreen('welcome')} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicArea />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

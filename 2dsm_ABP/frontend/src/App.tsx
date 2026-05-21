import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import ChatScreen from './components/ChatScreen';
import Login from './pages/Login';
import Admin from './pages/Admin';

type Screen = 'welcome' | 'chat';

function PublicArea() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [userType, setUserType] = useState<string>('');

  const handleSelect = (type: string): void => {
    setUserType(type);
    setScreen('chat');
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full">
        {screen === 'welcome' ? (
          <WelcomeScreen onSelect={handleSelect} />
        ) : (
          <ChatScreen userType={userType} onBack={() => setScreen('welcome')} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicArea />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
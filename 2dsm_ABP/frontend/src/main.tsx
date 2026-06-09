import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChatProvider } from './state/ChatContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ChatProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ChatProvider>
);
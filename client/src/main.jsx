
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.jsx'
import { ChatProvider } from '../context/ChatContext.jsx'
import { VideoCallProvider } from '../context/VideoCallContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthProvider>
    <ChatProvider>
      <VideoCallProvider>
            <App />
      </VideoCallProvider>    
    </ChatProvider>
  </AuthProvider>
  </BrowserRouter>,
)

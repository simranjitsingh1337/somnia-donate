import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { Web3Provider } from './context/Web3Context.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Web3Provider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'bg-white text-gray-800 shadow-lg rounded-xl p-4',
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </Web3Provider>
    </BrowserRouter>
  </StrictMode>,
)

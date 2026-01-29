import React from 'react'
import ReactDOM from 'react-dom/client'
// 1. Change BrowserRouter to HashRouter
import { HashRouter } from 'react-router-dom' 
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Use HashRouter here */}
    <HashRouter> 
      <App />
    </HashRouter>
  </React.StrictMode>,
)
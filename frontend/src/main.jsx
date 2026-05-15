import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

/**
 * main.jsx
 * 
 * React uygulamasının başlangıç noktasıdır.
 * 'root' elementini bulur ve App bileşenini buraya monte (mount) eder.
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

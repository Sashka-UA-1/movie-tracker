// ─────────────────────────────────────────────────────────────
// src/main.tsx
//
// Точка входу застосунку.
// Монтує React у DOM-елемент #root з index.html.
// ─────────────────────────────────────────────────────────────

import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

// Глобальні стилі — CSS-змінні, reset, базові правила
import './styles/global.css'

// StrictMode вмикає додаткові перевірки у development-режимі:
// подвійний рендер, попередження про застарілі API тощо.
// У production він нічого не робить.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

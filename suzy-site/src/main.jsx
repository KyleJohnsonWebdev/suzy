import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Prerendered pages arrive with their HTML in place: hydrate it. The plain
// shell (404.html, used for anything not prerendered) starts empty: render.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)

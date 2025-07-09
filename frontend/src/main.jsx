import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App.jsx'
import ThemeProvider from './components/ThemeProvider.jsx'
import './index.css'
import { persistor, store } from "./redux/store.js"

createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>

          <App />

        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </PersistGate>
)

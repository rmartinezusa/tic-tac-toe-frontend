import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { Provider, useSelector } from 'react-redux';
import store from './store/store.js';
import './index.css';

import { SocketProvider } from './context/SocketContext.jsx';
import { selectToken } from './services/authSlice';

function AppWithSocket() {
  const token = useSelector(selectToken);

  return (
    <SocketProvider token={token}>
      <App />
    </SocketProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppWithSocket />
  </Provider>
);


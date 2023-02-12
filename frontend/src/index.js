import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider as ApiProvider } from './context/apis';
import { Provider as ShowPageProvider } from './context/showPage';

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);

root.render(
  <ShowPageProvider>
    <ApiProvider>
      <App />
    </ApiProvider>
  </ShowPageProvider>
);

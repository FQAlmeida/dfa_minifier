// Global Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Local Imports
import './global/style.sass';
import App from './layout/App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();

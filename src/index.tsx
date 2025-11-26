import React from 'react';
import ReactDOM from 'react-dom';
import 'react-tippy/dist/tippy.css';
import './index.css';
import './App.css';
import App from './App';
import { ZakekeEnvironment, ZakekeProvider } from '@zakeke/zakeke-configurator-react';
import { DialogsRenderer } from 'components/dialogs/Dialogs';

const zakekeEnvironment = new ZakekeEnvironment();

ReactDOM.render(
  <React.StrictMode>
    <ZakekeProvider environment={zakekeEnvironment}>
      <App />
      <DialogsRenderer />
    </ZakekeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

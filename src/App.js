import './App.css';
import './main.scss';

import {
  PageFooter,
  PageHeader,
  PageRouting,
} from 'components/Pages';

import { AuthProvider } from 'context/AuthContext';
import { MessageProvider } from 'context/MessageContext';

import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <MessageProvider>
        <AuthProvider>
          <PageHeader />
          <PageRouting />
          <PageFooter />
        </AuthProvider>
      </MessageProvider>
    </BrowserRouter>
  );
}

export default App;

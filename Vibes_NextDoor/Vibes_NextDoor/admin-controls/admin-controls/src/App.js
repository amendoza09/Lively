import React, { useState } from 'react';

import AdminLogin from './components/AdminLogin';
import AdminPanel from './AdminPanel';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <AdminLogin onLogInSuccess={handleLogin()} />
      ) : (
        <AdminPanel />
      )}
    </div>
  );
};

export default App;
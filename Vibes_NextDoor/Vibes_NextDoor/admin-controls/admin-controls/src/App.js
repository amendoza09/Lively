import React, { useState } from 'react';

import AdminLogin from './components/AdminLogin';
import AdminPanel from './AdminPanel';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <AdminLogin onLoginSuccess={handleLogin} />
      ) : (
        <AdminPanel onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
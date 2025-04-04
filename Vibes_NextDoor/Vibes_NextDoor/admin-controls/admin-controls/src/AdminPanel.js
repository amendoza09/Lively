import React, { useState } from 'react';

import EventPage from './components/EventPage';
import AccountPage from './components/AccountPage';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState(null);

  return (
    <div className="flex h-screen">
      <div className="w-1/5 bg-gray-800 text-white ">
        <h2 className="text-leg font-bold mb-4 p-4">Admin Panel</h2>
        <ul className="list-none">
          <li className={`p-4 cursor-pointer ${
            activeTab === "events" ? "bg-gray-600" : ""
            }`}
            onClick={() => setActiveTab("events")}
          >
            Events
          </li>
          <li className={`p-4 cursor-pointer ${
            activeTab === "accounts" ? "bg-gray-600" : ""
            }`}
            onClick={() => setActiveTab("accounts")}
          >
            Accounts
          </li>
        </ul>
      </div>
      <div className="flex-1 p-4">
        {activeTab === "events" && <EventPage />}
        {activeTab === "accounts" && <AccountPage />}
      </div>
    </div>
  );
}

export default AdminPanel;
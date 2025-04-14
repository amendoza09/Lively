import React, { useEffect, useState } from 'react';

const AccountPage = () => {
  const [pendingAccounts, setPendingAccounts] = useState({});
  const [approvedAccounts, setApprovedAccounts] = useState({});
  const [activeTab, setActiveTab] = useState("pending");

    useEffect(() => {
      const fetchPendingAccounts = async () => {
        try {
          const response = await fetch("http://192.168.40.132:5500/pending-accounts");
          const data = await response.json();
          console.log("pendingAccounts:", data);
          setPendingAccounts(data); 
        } catch (error) {
          console.error("Error fetching pending events:", error);
        }
      };

      const fetchApprovedAccounts = async () => {
        try {
            const response = await fetch("http://192.168.1.17:5500/approved-accounts");
            const data = await response.json();
            console.log("approvedAccounts:", data);
            setApprovedAccounts(data)
        } catch (error) {
          console.error("Error fetching approved events:", error);
        }
      };
      fetchApprovedAccounts();
      fetchPendingAccounts();
    }, []);

  const approveAccount = async (id) => {

  };

  const rejectAccount = async (id) => {

  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            className={`px-4 py-2 ${activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Accounts ({Object.values(pendingAccounts).reduce((acc, accounts) => acc + accounts.length, 0)})
          </button>
          <button
            className={`px-4 py-2 ml-2 ${activeTab === "approved" ? "bg-green-500 text-white" : "bg-gray-300"}`}
            onClick={() => setActiveTab("approved")}
          >
            Approved Accounts ({Object.values(approvedAccounts).reduce((acc, accounts) => acc + accounts.length, 0)})
          </button>
        </div>
      </div>

      {activeTab === "pending" && (
        <>
          {Object.values(pendingAccounts).map((account) => (
            <div key={account._id} className="mb-4">
              <details className="border rounded-md p-2">
                <summary className="cursor-pointer font-bold">{account.organization_name}</summary>
                <table className="w-full border-collapse border border-gray-400 mt-2">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Account Owner</th>
                      <th className="border p-2">Date Created</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={account._id}>
                      <td className="border p-2">{account.account_owner}</td>
                      <td className="border p-2">{new Date(account.createdAt).toLocaleDateString()}</td>
                      <td className="border p-2">
                        <button className="bg-green-500 text-white px-2 py-1 mr-2" onClick={() => approveAccount(account._id)}>
                          Approve
                        </button>
                        <button className="bg-red-500 text-white px-2 py-1" onClick={() => rejectAccount(account._id)}>
                          Reject
                        </button>
                      </td>                            
                    </tr>
                  </tbody>
                </table>
              </details>
            </div>
          ))}
        </>
      )}

      {/* Approved Events Tab */}
      {activeTab === "approved" && (
        <>
          {Object.values(approvedAccounts).map((account) => (
            <div key={account._id} className="mb-4">
              <details className="border rounded-md p-2">
                <summary className="cursor-pointer font-bold">
                  {account.organization_name}
                </summary>
                <ul className="list-disc pl-5">
                  <li key={account._id}>{account.organizer_name} - {new Date(account.date).toLocaleDateString()}</li>                
                </ul>
              </details>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AccountPage;
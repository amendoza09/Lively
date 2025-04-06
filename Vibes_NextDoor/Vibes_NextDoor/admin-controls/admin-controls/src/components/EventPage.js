import React, { useEffect, useState } from 'react';

const EventPage = () => {
  const [eventsByCity, setEventsByCity] = useState({});
  const [approvedByCity, setApprovedByCity] = useState({});
  const [activeTab, setActiveTab] = useState("pending");

    useEffect(() => {
      const fetchPendingEvents = async () => {
        try {
          const response = await fetch("http://192.168.1.17:5500/pending-events");
          const data = await response.json();
          setEventsByCity(data); 
        } catch (error) {
          console.error("Error fetching pending events:", error);
        }
        
      };

      const fetchApprovedEvents = async () => {
        try {
                const response = await fetch("http://192.168.1.17:5500/approved-events");
                const data = await response.json();
                setApprovedByCity(data);
            } catch (error) {
                console.error("Error fetching approved events:", error);
            }
        };

        fetchPendingEvents();
        fetchApprovedEvents();
    }, []);

  const approveEvent = async (id) => {

  };

  const rejectEvent = async (id) => {

  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            className={`px-4 py-2 ${activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Events ({Object.values(eventsByCity).reduce((acc, events) => acc + events.length, 0)})
          </button>
          <button
            className={`px-4 py-2 ml-2 ${activeTab === "approved" ? "bg-green-500 text-white" : "bg-gray-300"}`}
            onClick={() => setActiveTab("approved")}
          >
            Approved Events ({Object.values(approvedByCity).reduce((acc, events) => acc + events.length, 0)})
          </button>
        </div>
      </div>

      {activeTab === "pending" && (
        <>
          {Object.keys(eventsByCity).map((city) => (
            <div key={city} className="mb-4">
              <details className="border rounded-md p-2">
                <summary className="cursor-pointer font-bold">{city} ({eventsByCity[city].length} events)</summary>
                <table className="w-full border-collapse border border-gray-400 mt-2">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Event Name</th>
                      <th className="border p-2">Date</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsByCity[city].map((event) => (
                      <tr key={event._id}>
                          <td className="border p-2">{event.title}</td>
                          <td className="border p-2">{new Date(event.date).toLocaleDateString()}</td>
                          <td className="border p-2">
                            <button className="bg-green-500 text-white px-2 py-1 mr-2" onClick={() => approveEvent(event._id)}>
                              Approve
                            </button>
                            <button className="bg-red-500 text-white px-2 py-1" onClick={() => rejectEvent(event._id)}>
                              Reject
                            </button>
                          </td>
                                                  
                      </tr>
                    ))}
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
                    {Object.keys(approvedByCity).map((city) => (
                        <div key={city} className="mb-4">
                            <details className="border rounded-md p-2">
                                <summary className="cursor-pointer font-bold">{city} ({approvedByCity[city].length} approved)</summary>
                                <ul className="list-disc pl-5">
                                    {approvedByCity[city].map((event) => (
                                        <li key={event._id}>{event.title} - {new Date(event.date).toLocaleDateString()}</li>
                                    ))}
                                </ul>
                            </details>
                        </div>
                    ))}
                </>
            )}
    </div>
  );
};

export default EventPage;
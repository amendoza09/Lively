import React, { useEffect, useState } from 'react';

const EventPage = () => {
  const [eventsByCity, setEventsByCity] = useState({});
  const [approvedByCity, setApprovedByCity] = useState({});
  const [rejectedByCity, setRejectedByCity] = useState({});
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchPendingEvents();
    fetchApprovedEvents();
    fetchRejectedEvents();
  }, []);

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

  const fetchRejectedEvents = async () => {
    try {
      const response = await fetch("http://192.168.1.17:5500/rejected-events");
      const data = await response.json();
      setRejectedByCity(data);
    } catch (error) {
      console.error("Error fetching rejected events:", error);
    }
  };
  
  const approveEvent = async (event) => {
    const city = event.city;
    try{
      await fetch(`http://192.168.1.17:5500/event-data/${city}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({event})
      });
      fetchPendingEvents();
      fetchApprovedEvents();
    } catch(e) {
      console.error("Error approving event:", e);
    };
  };

  const rejectEvent = async (event) => {
    const city = event.city;
    try{
      await fetch(`http://192.168.1.17:5500/rejected-events/${city}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({event})
        }
      )
      fetchPendingEvents();
      fetchRejectedEvents();
    } catch(e) {
      console.error("Error rejecting event:", e);
    };
  };


  const EventRow =({ event, approveEvent, rejectEvent }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <>
        <tr key={event._id}>
          <td className="border p-2">{event.title}</td>
          <td className="border p-2">{new Date(event.date).toLocaleDateString()}</td>
          <td className="border p-2">
            <button className="bg-green-500 text-white px-2 py-1 mr-2" onClick={() => approveEvent(event)}>
              Approve
            </button>
            <button className="bg-red-500 text-white px-2 py-1 mr-2" onClick={() => rejectEvent(event)}>
              Reject
            </button>
            <button className="bg-gray-500 text-white px-2 py-1" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Hide" : " View Details"}
            </button>
          </td>                      
        </tr>

        {expanded && (
          <tr>
            <td colSpan={3} className="border p-4 bg-gray-100">
              <div>
                <p><span className="font-bold">Type:</span> {event.type}</p>
                <p><span className="font-bold">Location:</span> {event.location}</p>
                <p><span className="font-bold">Description:</span> {event.description}</p>
                <p><span className="font-bold">Email:</span> {event.email}</p>
                <p><span className="font-bold">Phone:</span> {event.phone}</p>
                {event.imageUrl && (
                  <img 
                    src={event.imageUrl}
                    alt="Event"
                    className="mt-2 max-w-xs"
                  />
                )}
              </div>
            </td>
          </tr>
        )}
      </>
    );
  }

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
          <button
            className={`px-4 py-2 ml-2 ${activeTab === "rejected" ? "bg-red-500 text-white" : "bg-gray-300"}`}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected Events ({Object.values(rejectedByCity).reduce((acc, events) => acc + events.length, 0)})
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
                      <EventRow 
                        key={event}
                        event={event}
                        approveEvent = {approveEvent}
                        rejectEvent = {rejectEvent}
                      />
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

      {/* Rejected Events tab */}
      {activeTab === "rejected" && (
        <>
          {Object.keys(rejectedByCity).map((city) => (
            <div key={city} className="mb-4">
              <details className="border rounded-md p-2">
                <summary className="cursor-pointer font-bold">{city} ({rejectedByCity[city].length} rejected)</summary>
                <ul className="list-disc pl-5">
                  {rejectedByCity[city].map((event) => (
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